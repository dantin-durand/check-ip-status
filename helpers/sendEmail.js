const nodemailer = require("nodemailer");

// Fonction pour envoyer un e-mail
async function sendEmail(subject, message) {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_ENCRYPTION == "ssl" ? true : false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Configuration du courrier électronique
  let mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: process.env.MAIL_TO_ADDRESS,
    subject: subject,
    text: message,
  };

  // Envoi du courrier électronique
  await transporter.sendMail(mailOptions);
}
exports.sendEmail = sendEmail;
