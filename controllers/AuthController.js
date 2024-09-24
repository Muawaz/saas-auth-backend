const { addnewuser, finduserbyid, verifyLogin } = require("../services/auth.js");
const User = require("../models/UserModel.js");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET



async function login(req, res, next) {
  const { email, password } = req.body;
  console.log('email1 : ', email);
  console.log('password1 : ', password);
  
  

  if ( !email || !password ) {
    return res.status( 401 ).json({
      status: false,
      message: "Email or Password not present",
    })
  }

  let verification = await verifyLogin(req, res, next);  
  
}

async function createnewuser(req, res) {
  let userdata = req.body;
  console.log(userdata, "from auth controller");

  if (
    Object.keys(userdata).length === 0 ||
    !userdata.name ||
    !userdata.email ||
    !userdata.password
  ) {
    return res
      .status(401)
      .json({ status: 0, message: "All fields are required" });
  }
  let newuser = await addnewuser(userdata, res);
  if (!newuser.success) {
    res.status(401).json({ status: 0, message: newuser.message });
  } else {
    res
      .status(201)
      .json({ status: 1, message: newuser.message, user: newuser.user });
  }
}

async function verifyEmail(req, res) {
  const { token, userId } = req.query;
  console.log(token, userId, "From kontroller");

  const user = await finduserbyid({ token, userId });
  console.log(user);

  if (!user || !token || !userId) {
    return res
      .status(401)
      .json({ status: 0, message: "Invalid token and userId" });
  }

  const statusCode = user.status ? user.status : 400;
  res
    .status(statusCode)
    .json({ status: user.status, message: user.message, user: user });
}

module.exports = {
  createnewuser,
  verifyEmail,
  login,
};
