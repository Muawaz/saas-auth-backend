const User = require("../models/UserModel.js");
const crypto = require("crypto");
const { sendEmail } = require("../helpers/mailer.js");

exports.addnewuser = async (data) => {
  // console.log(data, "from ser");

  try {
    let userexists = await User.findOne({ where: { email: data.email } });
    if (userexists) {
      console.log("Email already exists.");
      return { success: false, message: "Email already exists." }; // Email exists
    }

    let response = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    console.log(response.dataValues.id, "from sersis");

    const verificationToken = crypto.randomBytes(32).toString("hex");
    response.verificationToken = verificationToken;
    await response.save();

    const verificationLink = `http://localhost:8080/api/user/verify-email?token=${verificationToken}&userId=${response.dataValues.id}`;
    console.log(verificationLink);

    await sendEmail(
      response.dataValues.email,
      "Verify your email",
      `
      <p>Hi ${response.dataValues.name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
    `
    );
    return {
      success: true,
      message: "User created successfully. Verification email sent.",
      user: response,
    };
  } catch (error) {
    console.log("Error while creating new user", error);
    return {
      success: false,
      message: "Error while creating new user.",
      error: error.message,
    };
  }
};

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
