const { Documents, sequelize } = require("../models/index")
const S3Service = require("../config/s3")
const {hash_password} = require('../helpers/hash')
const {asyncForEach} = require("../helpers/async_loop")
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

    static upsert = async (params, next) => {
        const transaction = await sequelize.transaction();
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

            let document = {}
            if (!params.id) {
                document = await Documents.create({
                    reference_type: params.reference_type,
                    key: uploadedFile.Key,
                    file_name: params.file_name,
                    file_type: params.file_type,
                    document_type: params.document_type,
                }, {returning: true},{transaction})
            }

            if (params.id != "") {
                let documentUpdate = await Documents.update({
                    reference_type: params.reference_type,
                    key: uploadedFile.Key,
                    file_name: params.file_name,
                    file_type: params.file_type,
                    document_type: params.document_type,
                }, {
                    where: {id: params.id},
                    returning: true
                },{transaction})

                document = documentUpdate[1][0]
            }
            await transaction.commit();
            return document
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

            const url = await S3Service.getSignedUrl('putObject', {
                Bucket: this.bucketName,
                Key: document.key,
                Expires: this.signedUrlExpireSeconds,
                ACL: "public-read",
                ContentDisposition:"inline",
                ContentType: document.file_type
            });

            return {
                object: url,
                url: process.env.OBJECT_URL + document.key
            }
        } catch (error) {
            next(error)
        }
    }

    static find = async(params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }

            let document = await Documents.findAll({
                where: {
                    reference_id: params.reference_id,
                    reference_type: params.reference_type
                }
            })

            return document
        } catch (error) {
            next(error)
        }
    }

    static updateReferenceId = async(params, next) => {
        try {
            if(!params) {
                throw {code: 404, message: 'need params'}
            }

            let documents = await Documents.findAll({
                where: {
                    reference_id: '00000000-0000-0000-0000-000000000000',
                    reference_type: params.reference_type,
                }
            })

            await asyncForEach(documents, async (el) => {
                await Documents.update({
                    reference_id: params.reference_id,
                }, {
                    where: {id: el.id}
                })
            })

            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = DocumentService