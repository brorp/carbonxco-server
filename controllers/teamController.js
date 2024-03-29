const pagination = require("../helpers/pagination");
const TeamService = require('../services/teams')

class TeamController {
    static post = async(req, res, next) => {
        try {
            let params = req.parameters;
            params = params.permit(
                "name",
                "position",
                "description",
                "link",
                { 'documents': [
                        "id",
                        "file_type",
                        "file_name",
                        "url",
                        "document_type",
                        "key"             
                    ] 
                }
            ).value()

            let data = await TeamService.create(params, next);
            if(data) {
                res.status(201).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    static all = async(req,res,next) => {
        try {
            let { page, limit } = req.query
            let data = await TeamService.all(req.query, next);
            if (data) {
                res.status(200).json(pagination(data, { page, limit }));
            }
        } catch (error) {
            next(error)
        }
    }

    static detail = async(req,res,next) => {
        try {
            let { id } = req.params;
            let admin = await TeamService.detail(id, next);
            if (admin) {
                res.status(200).json(admin);
            }
        } catch (error) {
            next(error)
        }
    }

    static update = async(req, res, next) => {
        try {
            let {id} = req.params
            let params = req.parameters;
            params = params.permit(
                "name",
                "position",
                "description",
                "link",
                { 'documents': [
                        "id",
                        "file_type",
                        "file_name",
                        "url",
                        "document_type",
                        "key"             
                    ] 
                }
            ).value()

            let data = await TeamService.update(id, params, next);
            if(data) {
                res.status(201).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    static delete = async(req,res,next) => {
        try {
            let { id } = req.params;
            let admin = await TeamService.delete(id, next);
            if (admin) {
                res.status(200).json({message: "Success Delete"});
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = TeamController