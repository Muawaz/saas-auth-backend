const jwt = require('jsonwebtoken');
const { De_Hash_Password } = require('./hash_util');
const Joi = require('joi');
const User = require('../../models/UserModel');
const { response_failed } = require('../error');

const jwtSecret = process.env.JWT_SECRET
const maxAge = parseInt(process.env.JWT_MAX_AGE_HRS) * 60 * 60

exports.validate_login_body = async (body, res) => {

    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).validate(body)

    if (error) {
        return await response_failed(res, 400,
            "LogIn request body does not contain valid data",
            error.details[0].message)
    }
    return
}

exports.Check_Login_User = async (email, password, res) => {
    const userexists = await User.scope('with_Password').findOne({ where: { email: email } });
    if (userexists) {
        const result = await De_Hash_Password(password, userexists.dataValues.password);
        if (result) return await User.findByPk(userexists.id);
    }
    await response_failed(res, 400, "User not Found")
    return
}

exports.generate_JWT_token = async (id, email, role, res) => {
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
        await response_failed(res, 400, "Error occurred in signing JWT...", error.message)
        return
    }
}

