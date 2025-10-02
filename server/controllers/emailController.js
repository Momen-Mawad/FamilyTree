const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
// load environment variables from environment
require("dotenv").config();
let sesClient;
let accessKeyId;
let secretAccessKey;
let region;
let senderEmail;

function initializeSesClient() {
  if (sesClient) return;

  // Use a local require here to ensure dotenv is checked (though main index.js should handle it)

  // Get and trim environment variables. This code runs only when called.
  accessKeyId = process.env.AWS_ACCESS_KEY_ID
    ? process.env.AWS_ACCESS_KEY_ID.trim()
    : undefined;
  secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    ? process.env.AWS_SECRET_ACCESS_KEY.trim()
    : undefined;
  region = process.env.AWS_REGION
    ? process.env.AWS_REGION.trim()
    : "eu-central-1";
  senderEmail = process.env.ADMIN_EMAIL
    ? process.env.ADMIN_EMAIL.trim()
    : undefined;

  // Check for critical missing variables now
  if (!accessKeyId || !secretAccessKey || !region || !senderEmail) {
    throw new Error(
      "AWS or ADMIN_EMAIL environment variables are not set or are invalid. Please check .env file."
    );
  }

  sesClient = new SESv2Client({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
}

const sendSesEmail = async (userEmail, verifyUrl) => {
  initializeSesClient();

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
  initializeSesClient();

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
