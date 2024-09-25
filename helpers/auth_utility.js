const Joi = require("joi");
const User = require("../models/UserModel.js");
const bcrypt = require('bcryptjs')
const crypto = require("crypto");
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const maxAge = parseInt(process.env.JWT_MAX_AGE_HRS)

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

exports.Check_Login_User = async (email, password, res) => {
    const userexists = await User.findOne({ where: { email: email } });
    if (userexists) {
        const result = await this.De_Hash_Password(password, userexists.dataValues.password);
        if (result) return userexists
    }
    return res
        .status(400)
        .json({
            success: false,
            message: "Login not successful",
            error: "User not found while logging in",
        })
}

exports.Hash_Password = async (password) => {
    let hash = await bcrypt.hash(password, 10);
    return hash
}

exports.De_Hash_Password = async (password, hash) => {
    let result = await bcrypt.compare(password, hash);
    return result;
}


exports.Create_New_User = async (name, email, password) => {
    let createdUser = await User.create({
        name: name,
        email: email,
        password: await this.Hash_Password(password),
    })
    return createdUser
}

exports.Validate_Login_Body = async (body, res) => {
    if (!body) {
        return res.status(400).json({
            status: false,
            message: 'Login Form Data not found',
        });
    }
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).validate(body)
    if (error) {
        console.log('LogIn request body does not contain valid data');
        return res.status(400).json({
            status: false,
            message: error.details[0].message,
        });
    }

    return;
}

exports.Validate_SignUp_Body = async (body, res) => {
    if (!body) {
        // console.log("Form Data not Found");
        return res.status(400).json({
            status: false,
            message: "Signup Form Data not Found",
        });
    }
    const { error } = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).validate(body);

    if (error) {
        console.log("SignUp request body does not contain valid data");
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

exports.Generate_JWT_Token = async (id, email, role, res) => {
    try {
        const token = jwt.sign(
            {
                id: id,
                email: email,
                role: role
            },
            jwtSecret,
            {
                expiresIn: maxAge,
            }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // in ms
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error occurred in signing JWT...",
            error: error.message,
        });
    }
}