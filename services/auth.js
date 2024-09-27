const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require("../models/UserModel.js");
const { sendEmail } = require("../helpers/mailer.js");
const { Check_New_User, Create_New_User, generate_verification_link } = require('../helpers/auth_utility/signup_utli.js');
const { Check_Login_User, generate_JWT_token } = require('../helpers/auth_utility/login_util.js');
const { response_ok, response_failed } = require('../helpers/error.js');
const { generate_otp, save_otp, otp_email } = require('../helpers/auth_utility/forget_util.js');



exports.add_new_user = async (data, res) => {
  try {

    if (await Check_New_User(data.email, res)) return

    let createdUser = await Create_New_User(data.name, data.email, data.password)

    return createdUser;

  } catch (error) {

    await response_failed(res, 400, "Error while creating new user.", error.message)
    return
  }
};

exports.verfication_email = async (user, res) => {
  try {
    const verificationLink = await generate_verification_link(user);

    await sendEmail(
      user.dataValues.email,
      "Verify your email",
      ` 
        <p>Hi ${user.dataValues.name},</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `
    );

  } catch (error) {

    await response_failed(res, 400, "Error while sending verification email.", error.message)
    return
  }

}

exports.finduserbyid = async (data) => {
  let { userId, token } = data;
  console.log(data, "from email");

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (user.dataValues.verificationToken !== token) {
      return {
        success: false,
        message: "Invalid token",
        Status: 401,
      };
    }

    if (user) {
      user.isVerified = true;
      user.verificationToken = null;
      await user.save();
      // console.log(user);

      return {
        success: true,
        message: "Email verified successfully",
        user: user,
        status: 200,
      };
    } else {
      return {
        success: false,
        message: "Invalid token || User id",
        status: 404,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Somethink went wrong while Email verified ${error}`,
      status: "401",
    };
  }
};

exports.verifyLogin = async (body, res) => {
  const { email, password } = body;
  try {

    const userexists = await Check_Login_User(email, password, res)

    if (!userexists) return

    return userexists.dataValues

  } catch (error) {
    await response_failed(res, 400, "An error occurred in login", error.message)
    return
  }
}

exports.storeAndSendOTP = async (email, res, next) => {

  try {

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      response_failed(res, 400, "User does not exist")
      return
    }

    const { otp, otpExp } = await generate_otp()

    if (! await save_otp(res, user, otp, otpExp)) return

    if (! await otp_email(res, user.dataValues)) return

    return user
  } catch (error) {
    await response_failed(res, 400, "Error occurred while storing and send OTP...", error.message)
    return
  }


}

