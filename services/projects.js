const { Projects, Documents, sequelize } = require("../models/index");
const { Op } = require("sequelize");
const DocumentService = require("./documents");
class ProjectService {
    static all = async (params, next) => {
        try {
            let where = {}
            let limit = params.limit || 5;
            let offset = (params.page - 1) * limit || 0;
            if (params.keyword) {
                where = {
                    [Op.or]: {
                        title: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        name: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        description: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        location: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        main_goal: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        sdg: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        community: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        key_factor: {
                            [Op.iLike]: `%${params.keyword}%`
                        }
                    }
                }
            }

            let projects = await Projects.findAndCountAll({
                where,
                distinct: true,
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ],
                limit,
                offset,
                order: [['createdAt', 'DESC']],
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
            
            let project = await Projects.create(params, {
                returning: true,
                transaction
            })

            let docParams = {
                documents: params.documents,
                reference_id: project.id,
                reference_type: "projects"
            }

            let document = await DocumentService.upsert(docParams, transaction, next);

            if(!document) {
                throw {code: 400, message: 'no documents found'}
            }

            let res = await Projects.findOne({
                where: {id: project.id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ],
                transaction
            })

            await transaction.commit();
            return res     
        } catch (error){
            await transaction.rollback();
            next(error)
        }
    }

    static update = async (id, params, next) => {
        const transaction = await sequelize.transaction();
        try {
            if(!params || !id) {
                throw {code: 404, message: 'need params or id'}
            }

            let project = await Projects.update(params, {
                where: {id}, 
                returning:true
            }, {transaction})
   
            let docParams = {
                documents: params.documents,
                reference_id: project[1][0].id,
                reference_type: "projects"
            }

            let document = await DocumentService.upsert(docParams, transaction, next);
            if(!document) {
                throw {code: 400, message: 'no documents found'}
            }

            let res = await Projects.findOne({
                where: {id: project[1][0].id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
            })

            await transaction.commit();
            return res
        } catch (error) {
            await transaction.rollback();
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
            });
            
            if (!existingProject) {
                throw {code: 404, message: 'data not found'}
            }

            let project = {}

            project = await Projects.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: {[Op.not]: id}
                        },
                        {
                            createdAt: {[Op.lt]: existingProject.createdAt}
                        }
                    ]
                },
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
                order: [['createdAt', 'DESC']],
                limit: 1
            })

            if (!project) {
                project = await Projects.findOne({
                    where: {
                        [Op.and]: [
                            {
                                id: {[Op.not]: id}
                            },
                            {
                                createdAt: {[Op.lt]: existingProject.createdAt}
                            }
                        ]
                    },
                    include: [
                        {
                            model: Documents, 
                            as: 'documents', 
                        },
                    ], 
                    order: [['createdAt', 'ASC']],
                    limit: 1
                })
            }

            return project
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProjectService