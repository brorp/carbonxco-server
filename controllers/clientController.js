const pagination = require("../helpers/pagination");
const ClientService = require('../services/clients')

class ClientController {
    static post = async(req, res, next) => {
        try {
            let params = req.parameters;
            params = params.permit(
                "name",
                "phone",
                "email",
                "subject",
                "body"
            ).value()

            let data = await ClientService.create(params, next);
            if(data) {
                res.status(201).json({message: "Success Create"})
            }
        } catch (error) {
            next(error)
        }
    }

    static all = async(req,res,next) => {
        try {
            let { page, limit } = req.query
            let data = await ClientService.all(req.query, next);
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
            let admin = await ClientService.detail(id, next);
            if (admin) {
                res.status(200).json(admin);
            }
        } catch (error) {
            next(error)
        }
    }

    static delete = async(req, res, next) => {
        try {
            let {id} = req.params

            let data = await ClientService.delete(id, next);
            if(data) {
                res.status(201).json({message: "Success Delete"})
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ClientController