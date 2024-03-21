const DocumentService = require('../services/documents')
class DocumentController {
    static post = async(req, res, next) => {
        try {
            console.log(req.file)
            let params = req.parameters;
            params.file = req.file.buffer
            params.file_type = req.file.mimetype
            params.file_name = req.file.originalname
            params.id = req.body.id
            params.reference_type = req.body.reference_type
            params.document_type = req.body.document_type
            params.size = req.file.size
            let data = await DocumentService.upsert(params, next);
            if(data) {
                res.status(201).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    static url = async(req, res, next) => {
        try {
            let { id } = req.params;
            let document = await DocumentService.getUrl(id, next)
            if (document) {
                res.status(200).json(document);
            } 
        } catch (error) {
            next(error)
        }
    }
}

module.exports = DocumentController