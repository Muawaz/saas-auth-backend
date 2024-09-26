const Joi = require("joi");
const crypto = require('crypto');
const { Hash_Password } = require("./hash_util");
const User = require("../../models/UserModel");
const { response_failed } = require("../error");

exports.validate_signup_body = async (body, res) => {

    const { error } = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).validate(body);

    if (error) {
        return await response_failed(res, 400,
            "SignUp request body does not contain valid data",
            error.details[0].message)
    }
    return
}

exports.Check_New_User = async (email, res) => {
    let userexists = await User.findOne({ where: { email: email } });
    if (userexists) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Email already exists.",
                user: userexists
            })
    } else return
}

exports.Create_New_User = async (name, email, password) => {
    let createdUser = await User.create({
        name: name,
        email: email,
        password: await Hash_Password(password),
    })
    return createdUser
}


exports.Generate_Verification_Link = async (user) => {

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    const verificationLink = `http://localhost:${process.env.PORT}/api/user/verify-email?token=${verificationToken}&userId=${user.dataValues.id}`;
    console.log(verificationLink);
    await user.save();
}