const { Projects, Documents, sequelize } = require("../models/index");
const { Op } = require("sequelize");

class ProjectService {
    static all = async (params, next) => {
        try {
            let where = {}
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

            if (params.status) {
                where.status = params.status
            }

            let projects = await Projects.findAndCountAll({
                where,
                order: [
                    ['id', 'DESC'],
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
            })

            let documents = await Documents.findAll({
                where: {
                    reference_id: id,
                    reference_type: "projects"
                }
            })

            let response = {
                project,
                documents,
            }

            return response
        } catch (error) {
            next(error)
        }
    }

    static create = async (params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }
            
            await Projects.create(params)

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

            await Projects.update(params, {where: {id}})

            return true
        } catch (error) {
            next(error)
        }
    }

    static delete = async (params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }

            await Projects.destroy({where: params.id})
            return true
        } catch {
            next(error)
        }
    }
}

module.exports = ProjectService