const {
  addnewuser,
  finduserbyid,
  verifyLogin,
  storeAndSendOTP,
} = require("../services/auth.js");
const User = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { sendEmail } = require("../helpers/mailer.js");
const { Op } = require('sequelize')

const jwtSecret = process.env.JWT_SECRET;

async function login(req, res, next) {
  const { email, password } = req.body;
  console.log("email1 : ", email);
  console.log("password1 : ", password);

  if (!email || !password) {
    return res.status(401).json({
      status: false,
      message: "Email or Password not present",
    });
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
  // if (!newuser.success) {
  //   res.status(401).json({ status: 0, message: newuser.message });
  // } else {
  //   res
  //     .status(201)
  //     .json({ status: 1, message: newuser.message, user: newuser.user });
  // }
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

async function user_forgotPassword(req, res, next) {
  const { email } = req.body;

  if (!email) {
    console.log("Form Data not Found");
    return res.status(400).json({
      status: false,
      message: "Form Data(email) not Found",
    });
  }

  const { error } = Joi.object({
    email: Joi.string().email().required(),
  }).validate(req.body);

  if (error) {
    console.log("Req body does not contain valid email address");
    return res.status(400).json({
      status: false,
      message: error.details[0].message,
    });
  }

  try {
    await storeAndSendOTP(req, res, next);
  } catch (err) {
    console.log(" Error while creating OTP ", err.message);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

async function user_resetPassword(req, res, next) {
  const body = req.body;
  if (!body) {
    console.log("Form Data(pass+otp) not Found");
    return res.status(400).json({
      status: false,
      message: "Form Data not Found",
    });
  }
  // console.log("body ran successful");


  try {
    const { error } = Joi.object({
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
      otp: Joi.string().required()
    }).validate(req.body);

    if (error) {
      console.log("Req body does not contain valid email address");
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }

    const password = body.password;
    const confirmPassword = body.confirmPassword;
    const otp = body.otp;

    // console.log('password : ', password);
    // console.log('confirmPassword : ', confirmPassword);
    // console.log('otp : ', otp);


    if (password.localeCompare(confirmPassword) != 0) {
      console.log("passwords are not equal");
      return res.status(400).json({
        status: false,
        message: "Passwords does not match",
      });
    }
    // console.log("localeCompare ran successful");

    const user = await User.findOne({
      where: {
        otp: otp,
        otpExpire: { [Op.gt]: new Date() }
      }
    });

    console.log('otpExpire : ', user.otpExpire);
    let date = new Date();
    console.log('New Date() : ', date);



    if (!user) {
      console.log('Invalid or Expired OTP');
      return res
        .status(400)
        .json({
          status: false,
          message: "Invalid or Expired OTP",
        });
    }

    console.log('before hashing');
    let new_hash = await bcrypt.hash(password, 10);
    console.log('new_hash : ', new_hash);
    
    try {
      console.log('before saving new password');
      user.password = new_hash
      user.otp = null
      user.otpExpire = null
      await user.save();
      console.log('userr : ', user);

    } catch (err) {
      console.log(" Error while new Password ", err.message);
      return res.status(500).json({
        status: false,
        message: err.message
      })
    }

    return res
      .status(201)
      .json({
        status: true,
        message: "Password reset successful",
        user: user
      });
  } catch (err) {
    console.log(" Error Resetting the password ", err.message);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }

}

module.exports = {
  createnewuser,
  verifyEmail,
  login,
  user_forgotPassword,
  user_resetPassword,
};
