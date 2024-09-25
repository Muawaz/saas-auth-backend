const Joi = require("joi");
const User = require("../models/UserModel.js");
const bcrypt = require('bcryptjs')
const crypto = require("crypto");


exports.Check_New_User = async (email, res) => {
    let userexists = await User.findOne({ where: { email: email } });
    if (userexists) {
        console.log("Email already exists.");
        return res.status(401).json({
            success: false,
            message: "Email already exists.",
            user: userexists
        }) // Email exists
    }
    return;
}

exports.Hash_Password = async (password) => {
    let hash = await bcrypt.hash(password, 10);
    return hash
}


exports.Create_New_User = async (name, email, password) => {
    let createdUser = await User.create({
        name: name,
        email: email,
        password: await this.Hash_Password(password),
    })
    return createdUser
}

exports.Validate_Body = async (body, res) => {
    if (!body) {
        // console.log("Form Data not Found");
        return res.status(400).json({
            status: false,
            message: "Form Data not Found",
        });
    }
    const { error } = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).validate(body);

    if (error) {
        console.log("Req body does not contain valid email address");
        return res.status(400).json({
            status: false,
            message: error.details[0].message,
        });
    }
}

exports.Generate_Verification_Link = async (user) => {

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    const verificationLink = `http://localhost:${process.env.PORT}/api/user/verify-email?token=${verificationToken}&userId=${user.dataValues.id}`;
    console.log(verificationLink);
    await user.save();
}