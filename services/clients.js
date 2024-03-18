const { Clients, Users, sequelize } = require("../models/index")
const { Op } = require("sequelize");

class ClientService {
    static all = async (params, next) => {
        try {
            let where = {}
            let order = ['id','DESC']
            if (params.keyword) {
                where = {
                    name: {
                        [Op.iLike]: `%${params.keyword}%`
                    }
                }
            }

            if (params.sort && params.order) {
                order[0] = params.sort
                order[1] = params.order
            }

            let data = await Clients.findAndCountAll({
                where,
                include: {model: Users, attributes: ['name', 'email', 'phone']},
                order: [
                    order,
                ],
            });

            return data;
        } catch (error) {
            next(error)
        }
    }

    static detail = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params or id'}
            }

            let client = await Clients.findOne({
                where: {id},
                include: {model: Users, attributes: ['name', 'email', 'phone']},
            })
            if (!client) {
                throw {code: 404, message: 'data not found'}
            }
            return client
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

            let user = await Users.create({
                email: params.email,
                name: params.name,
                phone: params.phone,
                role: 'client'
            }, {transaction})

            if (!user) {
                throw {code: 404, message: 'error creating user'}
            }

            await Clients.create({
                user_id: user.id,
                subject: params.subject,
                body: params.body
            }, {transaction})

            await transaction.commit();

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

            await Clients.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ClientService