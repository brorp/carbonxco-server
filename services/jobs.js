const { Jobs, sequelize } = require("../models/index");
const { Op } = require("sequelize");

class JobService {
    static all = async (params, next) => {
        try {
            let where = {}
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
                attributes: {exclude: ["job_id", "user_id"]},
                order: [['createdAt', 'ASC']],
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
                attributes: {exclude: ["job_id", "user_id"]}
            })


            if (!job ){
                throw {code: 404, message: 'data not found'}
            }

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
            
            let job = await Jobs.create(params, {returning: true})

            return job
        } catch (error){
            next(error)
        }
    }

    static update = async (id, params, next) => {
        try {
            if(!params || !id) {
                throw {code: 404, message: 'need params or id'}
            }

            let job = await Jobs.update(params, {where: {id}}, {returning: true})

            return job[1][0]
        } catch (error) {
            next(error)
        }
    }

    static delete = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params id'}
            }

            await Jobs.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = JobService