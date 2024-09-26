const { add_new_user, finduserbyid, verifyLogin, storeAndSendOTP, new_user_email, } = require("../services/auth.js");
const User = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { sendEmail } = require("../helpers/mailer.js");
const { Op } = require('sequelize');
const { validate_signup_body } = require("../helpers/auth_utility/signup_utli.js");
const { validate_login_body, generate_JWT_token } = require("../helpers/auth_utility/login_util.js");
const { response_ok } = require("../helpers/error.js");

const jwtSecret = process.env.JWT_SECRET;

async function createnewuser(req, res) {

  if (await validate_signup_body(req.body, res)) return;

  const createdUser = await add_new_user(req.body, res);

  if (!createdUser) return

  if (await new_user_email(createdUser, res)) return

  return await response_ok(res, 200, "User created successfully. Verification email sent.", createdUser)

}

async function login(req, res, next) {

  if (await validate_login_body(req.body, res)) return;

  let user = await verifyLogin(req.body, res);

  if (!user) return

  await generate_JWT_token(user.id, user.email, user.role, res)

  return await response_ok(res, 200, "User LogIn Successful. Signed with JWT", user)
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
