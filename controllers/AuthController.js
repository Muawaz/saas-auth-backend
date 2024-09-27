const { add_new_user, finduserbyid, verifyLogin, storeAndSendOTP, verfication_email, } = require("../services/auth.js");
const User = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { sendEmail } = require("../helpers/mailer.js");
const { validate_signup_body } = require("../helpers/auth_utility/signup_utli.js");
const { validate_login_body, generate_JWT_token } = require("../helpers/auth_utility/login_util.js");
const { response_ok, response_failed } = require("../helpers/error.js");
const { validate_forgot_body } = require("../helpers/auth_utility/forget_util.js");
const { validate_reset_body, check_both_password, find_otp_user, save_new_password } = require("../helpers/auth_utility/reset_util.js");
const { Hash_Password, De_Hash_Password } = require("../helpers/auth_utility/hash_util.js");


const jwtSecret = process.env.JWT_SECRET;

async function createnewuser(req, res) {

  if (await validate_signup_body(req.body, res)) return;

  const createdUser = await add_new_user(req.body, res);

  if (!createdUser) return

  if (await verfication_email(createdUser, res)) return

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

  if (await validate_forgot_body(req.body, res)) return

  const { email } = req.body

  const otp_user = await storeAndSendOTP(email, res)
  if (!otp_user) return

  return await response_ok(res, 201, "OTP Saved. OTP email sent successfully", otp_user)

}

async function user_resetPassword(req, res, next) {

  if (await validate_reset_body(req.body, res)) return

  if (await check_both_password(req.body, res)) return

  const user_obj = await find_otp_user(req.body, res)
  if (!user_obj) return

  const new_hash = await Hash_Password(req.body.password);

  const result_user = await save_new_password(user_obj, new_hash, res)
  if (!result_user) return

  return await response_ok(res, 201, "Password reset successful", result_user)

}

module.exports = {
  createnewuser,
  verifyEmail,
  login,
  user_forgotPassword,
  user_resetPassword,
};
