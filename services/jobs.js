const { Jobs, sequelize } = require("../models/index");
const { Op } = require("sequelize");

class DocumentService {
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

            let jobs = await Jobs.findAndCountAll({
                where,
                order: [
                    ['id', 'DESC'],
                ],
            });

            return jobs;

        } catch (error) {
            next(error)
        }
    }

    static detail = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params or id'}
            }

            let blog = await Jobs.findOne({where: {id}})

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
            
            await Jobs.create(params)

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

            await Jobs.update(params, {where: {id}})

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

            await Jobs.destroy({where: params.id})
            return true
        } catch {
            next(error)
        }
    }
}

module.exports = DocumentService