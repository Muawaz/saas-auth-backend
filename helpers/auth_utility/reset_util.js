const Joi = require("joi");
const { Op } = require('sequelize');
const { response_failed } = require("../error");
const User = require("../../models/UserModel");


exports.validate_reset_body = async (body, res) => {
    const { error } = Joi.object({
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required(),
        otp: Joi.string().required()
    }).validate(body);

    if (error) {
        return await response_failed(res, 400,
            "Form does not contain valid reset data",
            error.details[0].message)
    }
    return
}

exports.check_both_password = async (body, res) => {
    const password = body.password;
    const confirmPassword = body.confirmPassword;
    const otp = body.otp;

    if (password.localeCompare(confirmPassword) != 0) {
        return await response_failed(res, 400, "Passwords does not match")
    }
    return
}

exports.find_otp_user = async (body, res) => {
    const otp = body.otp;

    const user = await User.findOne({
        where: { otp: otp, otpExpire: { [Op.gt]: new Date() } }
    });

    if (!user) {
        await response_failed(res, 400, 'Invalid or Expired OTP');
        return
    }
    return user;
}

exports.save_new_password = async (user, hash, res) => {
    try {
        user.password = hash
        user.otp = null
        user.otpExpire = null
        await user.save();
        return await User.findByPk(user.id);

    } catch (error) {
        await response_failed(res, 500, " Error while new Password ", error.message)
        return false

    }
}