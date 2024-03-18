const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_AWS_REGION'
});

const s3 = new AWS.S3();

// Function to upload a file to S3
async function uploadFileToS3(fileName, fileContent, next) {
  // Upload parameters
  const params = {
    Bucket: "bucket",
    Key: fileName,
    Body: fileContent
  };

  try {
    // Upload file to S3
    const data = await s3.upload(params).promise();
    console.log('File uploaded successfully:', data.Location);
    return data.Location;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
}

module.exports = {uploadFileToS3}