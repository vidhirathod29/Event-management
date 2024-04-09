const nodemailer = require('nodemailer');
const logger = require('../logger/logger');

const transport = nodemailer.createTransport({
  service: 'Gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'vidhirathod.shivinfotech@gmail.com',
    pass: 'auve syfn jkmu xbsi',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendOtp = (email, otp) => {
  const mailOptions = {
    from: 'vidhirathod.shivinfotech@gmail.com',
    to: email,
    subject: 'Your OTP for password reset',
    text: `Your OTP for password reset is ${otp}`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Error occurred while sending email: ', error);
      throw new Error('Error sending email.');
    } else {
      logger.info('Email has been sent: ', info.response);
    }
  });
};

module.exports = {
  sendOtp,
};