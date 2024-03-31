const { Documents, sequelize } = require("../models/index")
const S3Service = require("../config/s3")
const {hash_password} = require('../helpers/hash')
const {asyncForEach} = require("../helpers/async_loop");
class DocumentService {
    static bucketName = process.env.BUCKET;
    static signedUrlExpireSeconds = 60 * 30;

    static alphanumeric = () => {
        return hash_password((Date.now() + +Math.floor(Math.random() * 9999)).toString());
    };

    static validateTypeAndSizeOfFile = (params) => {
        let allowedExtension = [
            "application/pdf",
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/svg+xml",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        let allowedSized = 5 * 1024 * 1024

        if (!(params.type && params.size))
            throw { code: 400, message: 'need params' }

        if (!allowedExtension.includes(params.type))
            throw { code: 400, message: 'Not supported file extension' }

        if (allowedSized < params.size)
            throw { code: 400, message: 'File exceed maximum size' }
    }

    static extFile = (params) => {
        const parts = params.split('/');

        return parts[1];
    }

    static upload = async(params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }

            this.validateTypeAndSizeOfFile({
                size: params.size,
                type: params.file_type
            });

            const paramsS3 = {
                Bucket: this.bucketName,
                Key: this.alphanumeric() + '.' + this.extFile(params.file_type),
                Body: params.file,
                'Content-Type': params.file_type
            };

            const uploadedFile = await S3Service.upload(paramsS3).promise();

            let generatedUrl = process.env.OBJECT_URL + uploadedFile.Key
            if (params.file_type == "image/svg+xml") {
                const urlWithoutExtension = uploadedFile.Key.replace(/\.[^.]+$/, '');
                generatedUrl = process.env.OBJECT_URL + urlWithoutExtension + ".svg%2Bxml"
            }

            return {
                url: generatedUrl,
                key: uploadedFile.Key,
                file_type: params.file_type,
                file_name: params.file_name
            };
            
        } catch (error) {
            next(error)
        }
    }

    static upsert = async (params, transaction, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }

            let document = {}

            await asyncForEach(params.documents, async (el) => {
                if (!el.id) {
                    document = await Documents.create({
                        reference_id: params.reference_id,
                        reference_type: params.reference_type,
                        key: el.key,
                        file_name: el.file_name,
                        file_type: el.file_type,
                        document_type: el.document_type,
                        url: el.url,
                    }, {
                        returning: true,
                        transaction
                    })
                }

                if (el.id != "") {
                    let documentUpdate = await Documents.update({
                        key: el.key,
                        file_name: el.file_name,
                        file_type: el.file_type,
                        document_type: el.document_type,
                        url: el.url,
                    }, {
                        where: {id: el.id},
                        returning: true,
                        transaction
                    })
    
                    document = documentUpdate[1][0]
                }
            })

            return document
        } catch (error) {
            next(error)
        }
    }
    
    static delete = async(id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params or id'}
            }
            let document = await Documents.findOne({
                where: {id}
            })

            if(!document) {
                throw {code: 404, message: 'data not found'}
            }
            await Documents.destroy({
                where: {id}
            })

            return true
        } catch (error) {
            next(error)
        }
    }

    static getUrl = async(id, next) => {
        try {
            if(!id) {
                throw {code: 404, message: 'need params or id'}
            }

            let document = await Documents.findOne({
                where: {id}
            })

            if(!document) {
                throw {code: 404, message: 'data not found'}
            }

            const url = await S3Service.getSignedUrl('getObject', {
                Bucket: this.bucketName,
                Key: document.key,
                Expires: this.signedUrlExpireSeconds,
            });

            return {
                url
            }

        } catch (error) {
            next(error)
        }
    }
}

module.exports = DocumentService