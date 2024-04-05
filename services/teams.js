const { Teams, Documents, sequelize } = require("../models/index");
const { Op } = require("sequelize");
const DocumentService = require("./documents");
class TeamService {
    static all = async (params, next) => {
        try {
            let where = {}
            let limit = params.limit || 5;
            let offset = (params.page - 1) * limit || 0;
            if (params.keyword) {
                where = {
                    [Op.or]: {
                        position: {
                            [Op.iLike]: `%${params.keyword}%`
                        },
                        name: {
                            [Op.iLike]: `%${params.keyword}%`
                        }
                    }
                }
            }

            let teams = await Teams.findAndCountAll({
                where,
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
                distinct: true,
                limit,
                offset,
                order: [['createdAt', 'ASC']],
            });

            return teams;
            
        } catch (error) {
            next(error)
        }
    }

    static detail = async (id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params or id'}
            }

            let team = await Teams.findOne({
                where: {id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
            })

            return team
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
            
            let team = await Teams.create(params, {
                returning: true,
                transaction
            })
            
            let docParams = {
                documents: params.documents,
                reference_id: team.id,
                reference_type: "teams"
            }

            let document = await DocumentService.upsert(docParams, transaction, next);

            if(!document) {
                throw {code: 400, message: 'no documents found'}
            }

            let res = await Teams.findOne({
                where: {id: team.id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ],
                transaction
            })

            await transaction.commit();
            return res            
        } catch (error){
            await transaction.rollback();
            next(error)
        }
    }

    static update = async (id, params, next) => {
        const transaction = await sequelize.transaction();
        try {
            if(!params || !id) {
                throw {code: 404, message: 'need params or id'}
            }

            let team = await Teams.update(params, {
                where: {id},
                returning: true
            }, {transaction});

            let docParams = {
                documents: params.documents,
                reference_id: team[1][0].id,
                reference_type: "teams"
            }

            let document = await DocumentService.upsert(docParams, transaction, next);
            if(!document) {
                throw {code: 400, message: 'no documents found'}
            }

            team = await Teams.findOne({
                where: {id: team[1][0].id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
            })

            await transaction.commit();
            return team
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

            await Teams.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = TeamService