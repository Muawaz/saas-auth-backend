const User = require("../models/UserModel.js");
const crypto = require("crypto");
const sendEmail = require("../helpers/mailer.js");

exports.addnewuser = async (data) => {
  // console.log(data, "from ser");

  try {
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
    return response;
  } catch (error) {
    console.log("Error while creating new user");
  }
};

exports.finduserbyid = async (data) => {
  const user = await User.findOne({ where: { id: data.userId } });
};
