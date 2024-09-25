const jwt = require('jsonwebtoken');
const { De_Hash_Password } = require('./hash_util');
const Joi = require('joi');
const User = require('../../models/UserModel');

const jwtSecret = process.env.JWT_SECRET
const maxAge = parseInt(process.env.JWT_MAX_AGE_HRS)

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

exports.Check_Login_User = async (email, password, res) => {
    const userexists = await User.findOne({ where: { email: email } });
    if (userexists) {
        const result = await De_Hash_Password(password, userexists.dataValues.password);
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

