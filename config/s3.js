const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});

const s3 = new AWS.S3({
    Bucket: process.env.BUCKET,
    signatureVersion: 'v4'
});

module.exports = s3