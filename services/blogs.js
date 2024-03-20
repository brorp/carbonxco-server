const { Blogs, Documents, sequelize } = require("../models/index");
const { Op, Sequelize } = require("sequelize");
const DocumentService = require("./documents");
const {asyncForEach} = require("../helpers/async_loop")

class BlogService {
    static all = async (params, next) => {
        try {
            let where = {}
            let order = ['id', 'DESC']
            if (params.keyword) {
                where = {
                    [Op.or]: {
                        author: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        content: {
                            [Op.iLike]: `%${params.keyword}%`
                        }
                    }
                }
            }

            if (params.sort && params.order) {
                order[0] = params.sort
                order[1] = params.order
            }

            let blogs = await Blogs.findAndCountAll({
                where,
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ],
                order: [
                    order,
                ],
            });

            return blogs;

        } catch (error) {
            next(error)
        }
    }

    static detail = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params or id'}
            }

            let blog = await Blogs.findOne({
                where: {id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
            })

            if (!blog ){
                throw {code: 404, message: 'data not found'}
            }

            return blog
        } catch (error) {
            next(error)
        }
    }

    static create = async (params, next) => {
        const transaction = await sequelize.transaction();
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }
            
            let blog = await Blogs.create(params, {
                returning: true
            })

            let doc = await DocumentService.updateReferenceId({
                reference_id: blog.id,
                reference_type: "blogs"
            }, next);

            if(doc) {
                blog = await Blogs.findOne({
                    where: {id: blog.id},
                    include: [
                        {
                            model: Documents, 
                            as: 'documents', 
                        },
                    ], 
                })
                await transaction.commit();
                return blog
            }
            else {
                throw {code: 400, message: 'bad request'}
            }
        } catch (error){
            next(error)
        }
    }

    static update = async (id, params, next) => {
        try {
            if(!params || !id) {
                throw {code: 404, message: 'need params or id'}
            }

            await Blogs.update(params, {where: {id}})

            return true
        } catch (error) {
            next(error)
        }
    }

    static delete = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params id'}
            }

            await Blogs.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }

    static getMore = async(id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params id'}
            }

            let existingBlog = await Blogs.findOne({
                where: {id}
            })

            if (!existingBlog) {
                throw {code: 404, message: 'data not found'}
            }

            let blog = {}

            blog = await Blogs.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: {[Op.not]: {id}}
                        },
                        {
                            createdAt: {[Op.gt]: existingBlog.createdAt}
                        }
                    ]
                },
                order: [['createdAt', 'ASC']],
                limit: 1
            })

            if (!blog) {
                blog = await Blogs.findOne({
                    where: {
                        [Op.and]: [
                            {
                                id: {[Op.not]: {id}}
                            },
                            {
                                createdAt: {[Op.lt]: existingBlog.createdAt}
                            }
                        ]
                    },
                    order: [['createdAt', 'ASC']],
                    limit: 1
                })
            }

            return blog
        } catch (error) {
            next(error)
        }
    }
}

module.exports = BlogService