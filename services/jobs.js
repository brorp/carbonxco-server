const { Jobs, sequelize } = require("../models/index");
const { Op } = require("sequelize");

class JobService {
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
                        type: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        location: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                    }
                }
            }

            if (params.sort && params.order) {
                order[0] = params.sort
                order[1] = params.order
            }

            let jobs = await Jobs.findAndCountAll({
                where,
                order: [
                    order,
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

            let job = await Jobs.findOne({
                where: {id},
            })

            return job
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
        } catch (error) {
            next(error)
        }
    }
}

module.exports = JobService