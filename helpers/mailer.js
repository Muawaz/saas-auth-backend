const nodemailer = require("nodemailer");
console.log(process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(emailSpec) {
  const to = emailSpec.emailTo;
  const subject = emailSpec.emailSubject;
  const html = emailSpec.emailBody;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}

module.exports = {
  sendEmail,
};
