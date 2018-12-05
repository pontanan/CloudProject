const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: 'eAJlCJWKU0fFRydBF8elfGqVLZxLaPiVdjEfofY6',
    accessKeyId: 'AKIAJIJ7XVANO54KABGA',
    region: 'eu-west-1'
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cityforum-bucket-123',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})


module.exports = upload;