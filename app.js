const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const { connectDB } = require("./dbconnection/connection.js");
const compagin = require("./routes/compagin.router.js");
const user = require("./routes/user.router.js");
require("./models/associations.js");
app.use(express.json());

// Call the connectDB function to test the connection
connectDB();

app.use("/api/compagin", compagin);
app.use("/api/user", user);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
