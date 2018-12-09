const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const keys = require('./keys');

const credentials = new aws.Credentials(
  keys.keyId,
  keys.secretKey
);
const s3 = new aws.S3({
  credentials: credentials,
  region: "eu-west-1"
})

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cityforum-bucket-123',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '.jpeg')
    }
  })
})
 

module.exports = {
  upload,
  s3
}