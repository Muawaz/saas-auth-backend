const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const { connectDB } = require("./dbconnection/connection.js");
const compagin = require("./routes/compagin.router.js");
const user = require("./routes/user.router.js");
const { userAuth, adminAuth } = require("./middlewares/auth.js");
const cookieParser = require('cookie-parser')
require("./models/associations.js");
app.use(express.json());

// Call the connectDB function to test the connection
connectDB();
app.use(cookieParser());

app.use("/api/compagin", compagin);
app.use("/api/user", user);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
