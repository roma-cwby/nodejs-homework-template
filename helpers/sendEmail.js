const nodemailer = require('nodemailer');

const { META_PASS } = process.env;

const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'cwbyuser@meta.ua',
    pass: META_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  from: 'cwbyuser@meta.ua',
  subject: 'Verify email',
};

const sendEmail = async data => {
  await transport.sendMail({ ...email, ...data });
  return true;
};

module.exports = sendEmail;
