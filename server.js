const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS S3 Client
const s3 = new S3Client({
  region: 'your-aws-region'
});

// Configure multer to use S3 for storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your-s3-bucket-name',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
});

// Serve the static frontend files
app.use(express.static('public'));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).send('File uploaded successfully to S3');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});