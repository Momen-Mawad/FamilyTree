// server/controllers/emailController.js
const nodemailer = require("nodemailer");
require("dotenv").config();
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

class GoogleController {
  async contactForm(req, res) {
    const createTransporter = async () => {
      try {
        const oauth2Client = new OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({
          GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
        });
        const accessToken = await new Promise((resolve, reject) => {
          oauth2Client.getAccessToken((err, token) => {
            if (err) {
              console.log("Error: ", err);
              reject("Failed to create access token :(");
            }

            resolve(token);
          });
        });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.ADMIN_EMAIL,
            accessToken,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          },
        });
        return transporter;
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    const { name, email, message } = req.body;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Message from ${name}`,
      html: `<h1>You have a new message from a visitor!</h1><p>${message}</p>`,
    };

    let emailTransporter = await createTransporter();

    await emailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error: ", error);
        res.status(500).send("Failed to send email");
      } else {
        console.log("Email sent: ", info.response);
        res.status(200).send("Email sent successfully");
      }
    });
  }

  async sendConfirmationEmail(userEmail, verifyUrl) {
    const createTransporter = async () => {
      // ...same as before, but use process.env.ADMIN_EMAIL as 'user'...
      try {
        const oauth2Client = new OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({
          GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
        });
        const accessToken = await new Promise((resolve, reject) => {
          oauth2Client.getAccessToken((err, token) => {
            if (err) reject("Failed to create access token :(");
            resolve(token);
          });
        });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.ADMIN_EMAIL,
            accessToken,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          },
        });
        return transporter;
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: userEmail,
      subject: "Confirm your FamilyTree account",
      html: `
        <h1>Welcome to FamilyTree!</h1>
        <p>Click the link below to verify your email and activate your account:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    const transporter = await createTransporter();
    if (!transporter) throw new Error("Failed to create email transporter");

    return transporter.sendMail(mailOptions);
  }
}

const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
require("dotenv").config();

// 🚨 FIX: Explicitly check and trim environment variables for integrity 🚨
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
  region: region, // Use the trimmed region
  credentials: {
    // Use the trimmed keys
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

class SESController {
  async sendSesEmail(userEmail, verifyUrl) {
    const senderEmail = process.env.ADMIN_EMAIL;
    if (!senderEmail) {
      throw new Error("ADMIN_EMAIL environment variable is not set.");
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
  }

  async contactForm(req, res) {
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
  }
}

module.exports = new SESController();
