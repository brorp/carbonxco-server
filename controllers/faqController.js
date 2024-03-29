const pagination = require("../helpers/pagination");
const FaqService = require('../services/faqs.js')

class FaqController {
    static post = async(req, res, next) => {
        try {
            let params = req.parameters;
            params = params.permit(
                "question",
                "answer"
            ).value()

            let data = await FaqService.create(params, next);
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
            let data = await FaqService.all(req.query, next);
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
            let admin = await FaqService.detail(id, next);
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
                "question",
                "answer"
            ).value()

            let data = await FaqService.update(id, params, next);
            if(data) {
                res.status(201).json({message: "Success Update"})
            }
        } catch (error) {
            next(error)
        }
    }

    static archived = async(req, res, next) => {
        try {
            let {id} = req.params
            let params = req.parameters;
            params = params.permit(
                "is_archived"
            ).value()

            let data = await FaqService.update(id, params, next);
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
            let admin = await FaqService.delete(id, next);
            if (admin) {
                res.status(200).json({message: "Success Delete"});
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = FaqController