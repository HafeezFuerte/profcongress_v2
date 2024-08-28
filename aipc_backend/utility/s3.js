const fs = require('fs')
const config = require('../config')

const S3 = require('aws-sdk/clients/s3')
const s3 = new S3(config.AWS_S3)

function uploadFile(file) {
    var key = `${Math.floor(new Date().getTime()).toString()}_s${getFilesizeInBytes(file)}.${file.type.split("/")[1]}`
    
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStream,
        Key: key,
        ACL: 'public-read'
    }
    return s3.upload(uploadParams).promise()
}

function getFilesizeInBytes(file) {
    // var stats = fs.statSync(filename);
    var fileSizeInBytes = file.size;
    return fileSizeInBytes;
}

exports.fileUpload = uploadFile
exports.getFilesizeInBytes = getFilesizeInBytes