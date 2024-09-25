const nodemailer = require("nodemailer");
console.log(process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, html, emailId) {
  // console.log(to);
  const trackingPixel = `<img src="http://localhost:8080/emailstatus/isopen?emailId=${emailId}" width="1" height="1" alt="" style="display:none;">`;
  console.log(trackingPixel, "from sendEmail");

  const htmlWithTracking = html + trackingPixel;
async function sendEmail(emailSpec) {
  const to = emailSpec.emailTo;
  const subject = emailSpec.emailSubject;
  const html = emailSpec.emailBody;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlWithTracking,
  });
}

module.exports = {
  sendEmail,
};
