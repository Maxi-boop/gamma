const { S3 } = require("@aws-sdk/client-s3");

const ID = process.env.AWS_ACCESS_ID;
const SECRET = process.env.AWS_ACCESS_SECRET;

const s3 = new S3({
  credentials: {
    accessKeyId: ID,
    secretAccessKey: SECRET,
  },
  region: "us-east-2",
});

module.exports = s3;