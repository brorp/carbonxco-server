const { Faq, sequelize } = require("../models/index");
const { Op } = require("sequelize");

class FaqService {
    static all = async (params, next) => {
        try {
            let where = {}
            if (params.keyword) {
                where = {
                    [Op.or]: {
                        email: {
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

            let faqs = await Faq.findAndCountAll({
                where,
                order: [
                    ['id', 'DESC'],
                ],
            });

            return faqs;
        } catch (error) {
            next(error)
        }
    }

    static detail = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params or id'}
            }

            let faq = await Faq.findOne({where: {id}})

            return faq
        } catch (error) {
            next(error)
        }
    }

    static create = async (params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }
            
            await Faq.create(params)

            return true
        } catch {
            next(error)
        }
    }

    static update = async (id, params, next) => {
        try {
            if(!params || !id) {
                throw {code: 404, message: 'need params or id'}
            }

            await Faq.update(params, {where: {id}})

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

            await Faq.destroy({where: params.id})
            return true
        } catch {
            next(error)
        }
    }
}

module.exports = FaqService