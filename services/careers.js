const { Careers, Jobs, Users, Documents, sequelize } = require("../models/index");
const { Op } = require("sequelize");
const {hash_password} = require('../helpers/hash')
const DocumentService = require("./documents");
const { MailService } = require("./mail");
class CareerService {
    static all = async (params, next) => {
        try {
            let where = {}
            let limit = params.limit || 5;
            let offset = (params.page - 1) * limit || 0;
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

            let careers = await Careers.findAndCountAll({
                where,
                include: [
                    {model: Jobs, attributes: {exclude: "job_id"}, as: 'job'},
                    {model: Users, attributes: {exclude: ['password', 'role','updatedAt','createdAt']}, as: 'user'},
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ],
                attributes: ['id', 'createdAt', 'updatedAt'],
                limit,
                offset,
                order: [['createdAt', 'ASC']],
            });

            return careers;
        } catch (error) {
            next(error)
        }
    }

    static create = async (job_id, params, next) => {
        const transaction = await sequelize.transaction();
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }
            const currentDate = new Date();
            const currentTimeString = currentDate.toLocaleTimeString();

            let job = await Jobs.findOne({where: {id: job_id}});

            let user = await Users.create({
                email: params.email,
                name: params.name ? params.name : "default",
                password: hash_password(currentTimeString),
                phone: params.phone ? params.phone : "default",
                address: params.address,
                role: 'applicant'
            }, {
                returning: true,
                transaction
            });

            if(!user) {
                throw {code: 400, message: 'fail creating user'}
            }

            let career = await Careers.create({
                job_id: job_id,
                user_id: user.id,
            }, {
                returning: true,
                transaction
            });

            if(!career) {
                throw {code: 400, message: 'fail creating career'}
            }

            let docParams = {
                documents: params.documents,
                reference_id: career.id,
                reference_type: "careers"
            }
            let document = await DocumentService.upsert(docParams, transaction, next);

            if(!document) {
                throw {code: 400, message: 'no documents found'}
            }
            
            let res = await Careers.findOne({
                where: {id: career.id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                    {model: Jobs, attributes: {exclude: "job_id"}, as: "job"},
                    {model: Users, attributes: {exclude: 'password'}, as: "user"},
                ],
                transaction
            })

            if(!res) {
                throw {code: 400, message: 'response error'}
            }

            await MailService.sendJobMail({
                email: params.email,
                name: params.name,
                phone: params.phone,
                address: params.address,
                title: job.title,
                type: job.type,
                location: job.location
            }, next)

            await transaction.commit();
            return res
        } catch (error){
            await transaction.rollback();
            next(error)
        }
    }

    static delete = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params id'}
            }

            await Careers.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CareerService