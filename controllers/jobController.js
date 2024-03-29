const pagination = require("../helpers/pagination");
const JobService = require('../services/jobs')

class JobController {
    static post = async(req, res, next) => {
        try {
            let params = req.parameters;
            params = params.permit(
                "type",
                "title",
                "location",
                { 'requirement': [] },
                { 'qualification': [] }
            ).value()

            let data = await JobService.create(params, next);
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
            let { keyword, sort, order } = req.query
            let data = await JobService.all({ keyword, sort, order }, next);
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
            let data = await JobService.detail(id, next);
            if (data) {
                res.status(200).json(data);
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
                "type",
                "title",
                "location",
                { 'requirement': [] },
                { 'qualification': [] }
            ).value()

            let data = await JobService.update(id, params, next);
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
            let data = await JobService.delete(id, next);
            if (data) {
                res.status(200).json({message: "Success Delete"});
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = JobController