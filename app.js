require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { sendEmail } = require("./helpers/mailer.js");
const port = process.env.PORT;
const { connectDB } = require("./dbconnection/connection.js");
const compagin = require("./routes/compagin.router.js");
const user = require("./routes/user.router.js");
const { userAuth, adminAuth } = require("./middlewares/auth.js");
const cookieParser = require('cookie-parser')
require("./models/associations.js");

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify the allowed HTTP methods
    credentials: true, // If you want to send cookies or auth tokens
  })
);
app.use(express.json());

// Call the connectDB function to test the connection
connectDB();
app.use(cookieParser());

app.use("/api/compagin", compagin);
app.use("/api/user", user);
// app.use("/emailstatus", sentemailstatus);

// const recipientEmail = "samaxa1810@rinseart.com";
// const subject = "Test Email with Tracking";
// const emailBody = "<h1>Hello!</h1><p>This is a test email with tracking.</p>";
// const uniqueEmailId = "12345";
// sendEmail(recipientEmail, subject, emailBody, uniqueEmailId)
//   .then(() => {
//     console.log("Email sent!");
//   })
//   .catch((err) => console.error("Error sending email:", err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
