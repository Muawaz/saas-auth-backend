const Joi = require("joi");
const { response_failed } = require("../error");
const { sendEmail } = require("../mailer");

const Exp_time = parseInt(process.env.OTP_EXPIRY_MIN)

exports.validate_forgot_body = async (body, res) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
    }).validate(body);

    if (error) {
        return await response_failed(res, 400,
            "Form does not contain valid email address",
            error.details[0].message)
    }
    return
}

exports.generate_otp = async () => {

    const otp = Math.floor(Math.random() * 9000);
    const otpExp = new Date();
    otpExp.setMinutes(otpExp.getMinutes() + Exp_time);

    return { otp: otp, otpExp: otpExp }
}

exports.save_otp = async (res, user, otp, otpExp) => {
    try {
        user.otp = otp;
        user.otpExpire = otpExp;
        await user.save();
        return true
    } catch (error) {
        response_failed(res, 500, " Error while saving OTP ", error.message)
        return false
    }
}

exports.otp_email = async (res, user) => {
    try {
        await sendEmail(
            user.email,
            "Your OTP Code",
            `
                <p>Hi ${user.name},</p>
                <p>Your OTP code is: <strong>${user.otp}</strong></p>
                <p>Please use this code to complete your verification.</p>
                <p> .( YOUR CODE IS VALID UPTO ${Exp_time} MINUTE ). </p>
                <p>Thank you!</p>
            `
        )
        return true;
    } catch (error) {
        response_failed(res, 500, " Error while sending OTP email ", error.message)
        return false;
    }

}