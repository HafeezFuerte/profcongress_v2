module.exports = {
    development: {
        host: process.env.HOST,
        user: process.env.DBUSER,
        password: process.env.PASSWORD,
        database: process.env.DBNAME
    },
    AWS_S3: {
        region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    }
};




