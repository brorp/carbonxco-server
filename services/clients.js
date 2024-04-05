const { Clients, Users, sequelize } = require("../models/index")
const { Op } = require("sequelize");
const {hash_password} = require('../helpers/hash');
const { MailService } = require("./mail");
class ClientService {
    static alphanumeric = () => {
        return hash_password((Date.now() + +Math.floor(Math.random() * 9999)).toString());
    };

    static all = async (params, next) => {
        try {
            let where = {}
            let limit = params.limit || 5;
            let offset = (params.page - 1) * limit || 0;
            if (params.keyword) {
                where = {
                    name: {
                        [Op.iLike]: `%${params.keyword}%`
                    },
                    email: {
                        [Op.iLike]: `%${params.keyword}%`
                    },
                    subject: {
                        [Op.iLike]: `%${params.keyword}%`
                    },
                    body: {
                        [Op.iLike]: `%${params.keyword}%`
                    },
                }
            }

            let data = await Clients.findAndCountAll({
                where,
                include: {model: Users, attributes: ['name', 'email', 'phone']},
                limit,
                offset,
                order: [['createdAt', 'ASC']],
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
              
            let [user, isCreated] = await Users.findOrCreate({
                where: { email: params.email },
                defaults: {
                    email: params.email,
                    name: params.name,
                    phone: params.phone,
                    role: 'client',
                    password: this.alphanumeric()
                },
                transaction
            })

            let userId = user.id ? user.id : isCreated.id;

            if (!user) {
                throw {code: 404, message: 'error creating user'}
            }

            let client = await Clients.create({
                user_id: userId,
                subject: params.subject,
                body: params.body
            }, {transaction})

            if (!client) {
                throw {code: 404, message: 'error creating client'}
            }

            await MailService.sendContactusMail({
                email: params.email,
                name: params.name,
                phone: params.phone,
                subject: params.subject,
                body: params.body
            }, next)

            await transaction.commit();

            return true
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

            await Clients.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ClientService