const { Projects, Documents, sequelize } = require("../models/index");
const { Op } = require("sequelize");

class ProjectService {
    static all = async (params, next) => {
        try {
            let where = {}
            let order = ['id', 'DESC']
            if (params.keyword) {
                where = {
                    [Op.or]: {
                        title: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        name: {
                            [Op.iLike]: `%${params.keyword}%`
                        }
                    }
                }
            }

            if (params.sort && params.order) {
                order[0] = params.sort
                order[1] = params.order
            }

            let projects = await Projects.findAndCountAll({
                where,
                order: [
                    order,
                ],
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
            });

            return projects;

        } catch (error) {
            next(error)
        }
    }

    static detail = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params or id'}
            }

            let project = await Projects.findOne({
                where: {id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
            })

            return project
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
            
            let project = await Projects.create(params)
            let doc = await DocumentService.updateReferenceId({
                reference_id: project.id,
                reference_type: "projects"
            }, next);

            if(!doc) {
                throw {code: 400, message: 'no documents found'}
            }

            project = await Projects.findOne({
                where: {id: project.id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
            })
            await transaction.commit();
            return project     
        } catch (error){
            next(error)
        }
    }

    static update = async (id, params, next) => {
        try {
            if(!params || !id) {
                throw {code: 404, message: 'need params or id'}
            }

            await Projects.update(params, {where: {id}})

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

            await Projects.destroy({where: {id}})
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

            let existingProject = await Projects.findOne({
                where: {id}
            })

            if (!existingProject) {
                throw {code: 404, message: 'data not found'}
            }

            let project = {}

            project = await Projects.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: {[Op.not]: {id}}
                        },
                        {
                            createdAt: {[Op.gt]: existingProject.createdAt}
                        }
                    ]
                },
                order: [['createdAt', 'ASC']],
                limit: 1
            })

            if (!project) {
                project = await Projects.findOne({
                    where: {
                        [Op.and]: [
                            {
                                id: {[Op.not]: {id}}
                            },
                            {
                                createdAt: {[Op.lt]: existingProject.createdAt}
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

module.exports = ProjectService