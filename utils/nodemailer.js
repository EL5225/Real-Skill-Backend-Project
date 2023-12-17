require("dotenv").config();
const nodemailer = require("nodemailer");
const { SMTP_USER, SMTP_PASS } = process.env;

const sendEmail = async (to, subject, html) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: SMTP_USER,
      to,
      subject,
      html,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
