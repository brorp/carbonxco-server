const pagination = require("../helpers/pagination");
const CareerService = require('../services/careers')

class CareerController {
    static post = async(req, res, next) => {
        try {
            let { job_id } = req.params;
            let params = req.parameters;
            params = params.permit(
                "email",
                "name",
                "phone",
                "address",
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
            
            let data = await CareerService.create(job_id, params, next);
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
            let data = await CareerService.all(req.query, next);
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
            let admin = await CareerService.detail(id, next);
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
                "email",
                "name",
                "phone",
                "address"
            ).value()

            let data = await CareerService.update(id, params, next);
            if(data) {
                res.status(201).json({message: "Success Update"})
            }
        } catch (error) {
            next(error)
        }
    }

    static delete = async(req,res,next) => {
        try {
            let { id } = req.params;
            let data = await CareerService.delete(id, next);
            if (data) {
                res.status(200).json({message: "Success Delete"});
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CareerController