const nodemailer = require('nodemailer');
const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${token}`,
    };
  
    await transporter.sendMail(mailOptions);
  };

module.exports = {
    sendVerificationEmail,
};