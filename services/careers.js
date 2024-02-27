const { Careers, Jobs, Users, sequelize } = require("../models/index");
const { Op } = require("sequelize");

class CareerService {
    static all = async (params, next) => {
        try {
            let where = {}
            let order = ['id', 'DESC']
            if (params.keyword) {
                where = {
                    [Op.or]: {
                        '$Users.email$': {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        '$Users.phone$': {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        '$Users.name$': {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        '$Jobs.title$': {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        '$Jobs.location$': {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        '$Jobs.type$': {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                    }
                }
            }

            if (params.sort && params.order) {
                order[0] = params.sort
                order[1] = params.order
            }

            let careers = await Careers.findAndCountAll({
                where,
                include: [
                    {model: Jobs},
                    {model: Users, attributes: {exclude: 'password'}}
                ],
                order: [
                    order,
                ],
            });
            // @todo preload documents
            return careers;

        } catch (error) {
            next(error)
        }
    }

    static create = async (id, params, next) => {
        const transaction = await sequelize.transaction();
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }
            let user = await Users.create({
                email: params.email,
                name: params.name,
                phone: params.phone,
                address: params.address,
                role: 'applicant'
            }, {transaction})

            await Careers.create({
                job_id: id,
                user_id: user.id,
            }, {transaction})

            // @todo add send email
           
            await transaction.commit();
            return true
        } catch (error){
            next(error)
        }
    }

    static delete = async (params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }

            await Careers.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CareerService