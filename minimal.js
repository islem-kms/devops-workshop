require("dotenv").config({path:"./.env"})

const express = require('express');

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const app = express();

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    return res.json({ message: 'File uploaded successfully.' });
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});