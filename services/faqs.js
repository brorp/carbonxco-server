const { Faqs, sequelize } = require("../models/index")
const { Op } = require("sequelize");

class FaqService {
    static all = async (params, next) => {
        try {
            let where = {}
            let limit = params.limit || 5;
            let offset = (params.page - 1) * limit || 0;
            if (params.keyword) {
                where = {
                    [Op.or]: {
                        question: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        answer: {
                            [Op.iLike]: `%${params.keyword}%`
                        }
                    }
                }
            }

            let faqs = await Faqs.findAndCountAll({
                where,
                limit,
                offset,
                order: [['createdAt', 'ASC']],
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

            let faq = await Faqs.findOne({where: {id}})
            if (!faq) {
                throw {code: 404, message: 'data not found'}
            }
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
            await Faqs.create(params)

            return true
        } catch (error) {
            next(error)
        }
    }

    static update = async (id, params, next) => {
        try {
            if(!params || !id) {
                throw {code: 404, message: 'need params or id'}
            }

            await Faqs.update(params, {where: {id}})

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

            await Faqs.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = FaqService