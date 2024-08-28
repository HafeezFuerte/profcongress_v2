const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({ region: process.env.AWS_SES_REGION }); // Replace with your AWS region

class SesService {
  constructor() {

    this.ses = new AWS.SES({ 
        apiVersion: '2010-12-01' ,
        region: process.env.AWS_SES_REGION, // Replace with your AWS region
        credentials: {
        accessKeyId: process.env.AWS_SES_KEY, // Replace with your actual access key ID
        secretAccessKey: process.env.AWS_SES_SECRET // Replace with your actual secret access key
      }
      });

  }

  async sendEmail(toEmails, subject, message) {
    const params = {
      Destination: {
        ToAddresses: toEmails,
      },
      Message: {
        Body: {
        Html: {
            Data: message
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: process.env.AWS_SES_SENDER_MAIL, // Replace with your verified SES email
    };

    try {
      const data = await this.ses.sendEmail(params).promise();
      console.log(`Email sent: ${data.MessageId}`);
      return data;
    } catch (err) {
      console.error(err, err.stack);
      throw new Error('Error sending email');
    }
  }
}

module.exports = SesService;
