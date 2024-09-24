const { addnewuser, finduserbyid, verifyLogin, storeAndSendOTP } = require("../services/auth.js");
const User = require("../models/UserModel.js");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { sendEmail } = require("../helpers/mailer.js");

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
  console.log(userdata);

  if (!userdata.name || !userdata.email || !userdata.password) {
    res.status(401).json({ status: 0, message: "All fields are required" });
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

async function user_forgotPassword (req, res, next) {
  const { email } = req.body;

  if ( !email ) {
    console.log("Form Data not Found")
    return res
      .status ( 400 )
      .json({
        status: false,
        message: "Form Data not Found"
      })
  }

  const { error }  = Joi.object({
    email: Joi.string().email().required()
  }).validate(req.body);

  if ( error ) {
    console.log("Req body does not contain valid email address");
    return res
      .status( 400 )
      .json({
        status: false,
        message: error.details[0].message
      })
  }
  
  try {
    await storeAndSendOTP (req, res, next);
  } catch ( err ) {
    console.log(" Error while creating OTP ", err.message);
    return res
      .status( 500 )
      .json({
        status: false,
        message: err.message
      })
  }
  
}

module.exports = {
  createnewuser,
  verifyEmail,
  login,
  user_forgotPassword,
};
