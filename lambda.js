const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const { body, isBase64Encoded } = event;
    
    if (!isBase64Encoded || !body) {
      throw new Error('Invalid request: Missing or invalid base64-encoded body.');
    }

    const fileContent = Buffer.from(body, 'base64');

    const bucketName = "devops-workshop";//process.env.AWS_S3_BUCKET_NAME;
    const fileName = `uploads/somecontent.txt`;

    await s3
      .putObject({
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded to S3.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error uploading file to S3.', err: error }),
    };
  }
};
