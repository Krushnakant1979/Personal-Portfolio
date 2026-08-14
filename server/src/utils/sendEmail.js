const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using standard SMTP variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Message object
  const message = {
    from: `${process.env.FROM_NAME || 'Admin Portal'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
