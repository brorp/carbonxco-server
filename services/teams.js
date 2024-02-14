const { Team, sequelize } = require("../models/index");
const { Op } = require("sequelize");

class TeamService {
    static all = async (params, next) => {
        try {
            let where = {}
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

            if (params.status) {
                where.status = params.status
            }

            let teams = await Team.findAndCountAll({
                where,
                order: [
                    ['id', 'DESC'],
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

            let team = await Team.findOne({where: {id}})

            return team
        } catch (error) {
            next(error)
        }
    }

    static create = async (params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }
            
            await Team.create(params)

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

            await Team.update(params, {where: {id}})

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

            await Team.destroy({where: params.id})
            return true
        } catch {
            next(error)
        }
    }
}

module.exports = TeamService