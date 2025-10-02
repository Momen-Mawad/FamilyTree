const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  ? process.env.AWS_ACCESS_KEY_ID.trim()
  : undefined;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  ? process.env.AWS_SECRET_ACCESS_KEY.trim()
  : undefined;
const region = process.env.AWS_REGION
  ? process.env.AWS_REGION.trim()
  : "eu-central-1";

const sesClient = new SESv2Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const sendSesEmail = async (userEmail, verifyUrl) => {
  const senderEmail = process.env.ADMIN_EMAIL;

  if (!senderEmail) {
    throw new Error(
      `ADMIN_EMAIL environment variable is not set. Email is ${senderEmail}`
    );
  }

  const params = {
    FromEmailAddress: senderEmail,
    Destination: {
      ToAddresses: [userEmail],
    },
    Content: {
      Simple: {
        Subject: {
          Data: "Confirm your FamilyTree account",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <h1>Welcome to FamilyTree!</h1>
              <p>Click the link below to verify your email and activate your account:</p>
              <a href="${verifyUrl}">${verifyUrl}</a>
              <p>This link will expire in 24 hours.</p>
            `,
            Charset: "UTF-8",
          },
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent successfully. MessageId:", response.MessageId);
    return response;
  } catch (error) {
    console.error("Error sending email via SES API:", error);
    throw error;
  }
};

const contactForm = async (req, res) => {
  const { name, email, message } = req.body;
  const senderEmail = process.env.ADMIN_EMAIL;
  if (!senderEmail) {
    return res.status(500).json({ message: "ADMIN_EMAIL not set" });
  }

  const params = {
    FromEmailAddress: senderEmail,
    Destination: {
      ToAddresses: [senderEmail],
    },
    ReplyToAddresses: [email],
    Content: {
      Simple: {
        Subject: {
          Data: `Message from ${name}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `<h1>You have a new message from a visitor!</h1><p>${message}</p>`,
            Charset: "UTF-8",
          },
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Contact form email sent. MessageId:", response.MessageId);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending contact form email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

module.exports = {
  sendSesEmail,
  contactForm,
};
