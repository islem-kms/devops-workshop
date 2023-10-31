require("dotenv").config({path:"./.env"})

const express = require('express');

const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const app = express();

// Configure AWS SDK with your credentials
const s3Client = new S3Client({
  region: 'ca-central-1', // Change to your desired AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const fileName = req.file.originalname;
  const fileContent = fs.readFileSync(req.file.path);

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
  });

  try {
    const response = await s3Client.send(putObjectCommand);
    console.log('File uploaded successfully:', response);
    return res.json({ message: 'File uploaded to S3.' });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Error uploading file to S3.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
