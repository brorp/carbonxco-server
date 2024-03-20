const { Teams, Documents, sequelize } = require("../models/index");
const { Op } = require("sequelize");
const DocumentService = require("./documents");
class TeamService {
    static all = async (params, next) => {
        try {
            let where = {}
            let order = ['id', 'DESC']
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

            if (params.sort && params.order) {
                order[0] = params.sort
                order[1] = params.order
            }

            let teams = await Teams.findAndCountAll({
                where,
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
                order: [
                    order,
                ],
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
                returning: true
            })
            
            let doc = await DocumentService.updateReferenceId({
                reference_id: team.id,
                reference_type: "teams"
            }, next);

            if(!doc) {
                throw {code: 400, message: 'no documents found'}
            }

            team = await Teams.findOne({
                where: {id: team.id},
                include: [
                    {
                        model: Documents, 
                        as: 'documents', 
                    },
                ], 
            })
            await transaction.commit();
            return team            
        } catch (error){
            next(error)
        }
    }

    static update = async (id, params, next) => {
        try {
            if(!params || !id) {
                throw {code: 404, message: 'need params or id'}
            }

            await Teams.update(params, {where: {id}})

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

            await Teams.destroy({where: {id}})
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = TeamService