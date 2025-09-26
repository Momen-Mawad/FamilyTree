const nodemailer = require("nodemailer");
require("dotenv").config();
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

class EmailController {
  async contactForm(req, res) {
    const createTransporter = async () => {
      try {
        const oauth2Client = new OAuth2(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
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
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
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
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
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
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
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

module.exports = new EmailController();
