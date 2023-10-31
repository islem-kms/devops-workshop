require("dotenv").config({path:"./.env"})

const express = require('express');
const fs = require('fs');

const AWS = require('aws-sdk');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const app = express();
// Configure AWS SDK with your credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ca-central-1' // Change to your desired AWS region
});

// Create an S3 object
const s3 = new AWS.S3();

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Set your S3 bucket and file information
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const fileName = req.file.originalname;
    const fileContent = fs.readFileSync(req.file.path);

    console.log("here", process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_S3_BUCKET_NAME)
    console.log(bucketName, fileName, fileContent)

    // Parameters for the S3.putObject method
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent
    };

    // Upload the file to S3
    s3.putObject(params, (err, data) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'Error uploading file to S3.' });
        } else {
            console.log('File uploaded successfully:', data);
            return res.json({ message: 'File uploaded to S3.' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});