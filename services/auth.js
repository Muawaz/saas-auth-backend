const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require("../models/UserModel.js");
const { sendEmail } = require("../helpers/mailer.js");
const { Check_New_User, Create_New_User, Generate_Verification_Link } = require('../helpers/auth_utility/signup_utli.js');
const { Check_Login_User, generate_JWT_token } = require('../helpers/auth_utility/login_util.js');
const { response_ok, response_failed } = require('../helpers/error.js');



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

exports.new_user_email = async (user, res) => {
  try {
    const verificationLink = Generate_Verification_Link(user);

    const emailSpec = {
      emailTo: user.dataValues.email,
      emailSubject: "Verify your email",
      emailBody: `
          <p>Hi ${user.dataValues.name},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationLink}">Verify Email</a>
        `
    }
    await sendEmail(emailSpec);

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

exports.storeAndSendOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email: email } });
  // console.log(' FIND ONE RUN SUCCESSFULL in forgot password')
  // console.log('userrrr : ', user)

  if (!user) {
    return res
      .status(400)
      .json({
        message: "User does not exist",
        error: "User not found with forgot password",
      });
  }

  const otp = Math.floor(Math.random() * 9000);
  const optExp = new Date();
  optExp.setMinutes(optExp.getMinutes() + 1); // 1m expiry

  try {
    user.otp = otp;
    user.otpExpire = optExp;
    await user.save();
  } catch (err) {
    // console.log(" Error while saving OTP ", err.message);
    return res.status(500).json({
      status: false,
      message: err.message
    })
  }

  try {
    await sendEmail(
      user.email,
      "Your OTP Code",
      `<p>Hi ${user.name},</p>
       <p>Your OTP code is: <strong>${user.otp}</strong></p>
       <p>Please use this code to complete your verification.</p>
       <p> .( YOUR CODE IS VALID UPTO 1 MINUTE ). </p>
       <p>Thank you!</p>`
    );
  } catch (err) {
    // console.log(" Error while sending OTP email ", err.message);
    return res.status(500).json({
      status: false,
      message: err.message
    })
  }

  return res
    .status(201)
    .json({
      status: true,
      message: "OTP Saved. OTP email sent successfully",
      user: user
    });
}
