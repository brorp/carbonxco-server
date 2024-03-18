const { Blogs, Categories, sequelize } = require("../models/index");
const { Op } = require("sequelize");

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
            })

            return blog
        } catch (error) {
            next(error)
        }
    }

    static create = async (params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }
            
            await Blogs.create(params)

            return true
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