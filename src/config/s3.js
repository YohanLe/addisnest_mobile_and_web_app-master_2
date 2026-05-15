require('dotenv').config();

const { S3Client } = require('@aws-sdk/client-s3');

console.log('AWS CONFIG DEBUG:', {
  accessKey: process.env.AWS_ACCESS_KEY_ID?.slice(0,8),
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET_NAME,
  hasSecret: !!process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3;
