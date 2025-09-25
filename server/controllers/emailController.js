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
}

module.exports = new EmailController();
