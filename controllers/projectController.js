const pagination = require("../helpers/pagination");
const ProjectService = require('../services/projects')

class ProjectController {
    static post = async(req, res, next) => {
        try {
            let params = req.parameters;
            params = params.permit(
                "title",
                "description",
                "start_date",
                "location",
                "area",
                "area_description",
                "ecosystem_type",
                "community",
                "main_goal",
                "key_factor",
                "other",
                { 'sdg': [] },
                "status",
                "button_text",
                "button_link_to",
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

            let data = await ProjectService.create(params, next);
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
            let data = await ProjectService.all(req.query, next);
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
            let project = await ProjectService.detail(id, next);
            if (project) {
                res.status(200).json(project);
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
                "title",
                "description",
                "start_date",
                "location",
                "area",
                "area_description",
                "ecosystem_type",
                "community",
                "main_goal",
                "key_factor",
                "other",
                { 'sdg': [] },
                "status",
                "button_text",
                "button_link_to",
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

            let data = await ProjectService.update(id, params, next);
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
            let data = await ProjectService.delete(id, next);
            if (data) {
                res.status(200).json({message: "Success Delete"});
            }
        } catch (error) {
            next(error)
        }
    }

    static more = async(req,res,next) => {
        try {
            console.log(req.params, "<<<<")
            let { id } = req.params;
            
            let project = await ProjectService.getMore(id, next);
            if (project) {
                res.status(200).json(project);
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProjectController