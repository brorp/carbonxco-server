const { UUIDV4 } = require('sequelize');
const FaqService = require('../services/faqs.js')

class FaqController {
    static post = async(req, res, next) => {
        try {
            let params = req.parameters;
            params = params.permit(
                "question",
                "answer"
            ).value()
            params.id = UUIDV4
            let data = await FaqService.create(params, next);
            if(data) {
                res.status(201).json({message: "Success Create"})
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = FaqController