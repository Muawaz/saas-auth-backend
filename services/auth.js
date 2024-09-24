const bcrypt = require('bcryptjs')
const crypto = require("crypto");
const jwt = require('jsonwebtoken')
const User = require("../models/UserModel.js");
const { sendEmail } = require("../helpers/mailer.js");

const jwtSecret = process.env.JWT_SECRET

exports.addnewuser = async (data, res) => {
  // console.log(data, "from ser");

  try {
    let userexists = await User.findOne({ where: { email: data.email } });
    if (userexists) {
      console.log("Email already exists.");
      return { success: false, message: "Email already exists." }; // Email exists
    }

    let hash = await bcrypt.hash(data.password, 10);
    console.log('hashhhhh:   ', hash)
    console.log("type offf : ", typeof(hash));
    

    let response = await User.create({
      name: data.name,
      email: data.email,
      password: hash,
    })
    
    try {
      const maxAge = 3 * 60 * 60; // 3hrs in sec
      const token = jwt.sign(
        {
          id: response.dataValues.id,
          email: response.dataValues.email,
          role: response.dataValues.role
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

      // res.status(201).json({
      //   success: true,
      //   message: "User signed successfully with JWT.",
      //   user: response,
      // });

    } catch (error) {
      res.status( 400 ).json({
        success: false,
        message: "Error while creating JWT...",
        error: error.message,
      });
    }
    
    // console.log(response.dataValues.id, "from sersis");
    // console.log('response : ', response)
    
    const verificationToken = crypto.randomBytes(32).toString("hex");
    response.verificationToken = verificationToken;
    const verificationLink = `http://localhost:${process.env.PORT}/api/user/verify-email?token=${verificationToken}&userId=${response.dataValues.id}`;
    console.log(verificationLink);
    await response.save();

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

exports.verifyLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      // attributes: ['email'], // Specify the columns you want
      where: { email: email }
    });
    // console.log(' FIND ONE RUN SUCCESSFULL')
    // console.log('userrrr : ', user)

    if ( !user ) {
      res.status( 401 ).json({
        message: "Login not successful",
        error: "User not found while logging in",
      });
    } else {

      // Comparing given password with hashed password
      let result = await bcrypt.compare(password, user.password);
      // console.log('resulttt : ', result)

      if ( result ) {
        const maxAge = 3 * 60 * 60; // 3hrs in sec
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              role: user.role
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

          res.status(201).json({
            success: true,
            message: "User signed successfully with JWT.",
            user: user,
          });

        }
        else {
          res.status( 400 ).json({
            success: false,
            message: "Error occurred in JWT...",
            error: error.message,
          });
        }
    }
  } catch ( error ) {
    res.status( 400 ).json({
      success: false,
      message: "An error occurred in login",
      error: error.message,

    })
  }
}

exports.storeAndSendOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email: email } });
  // console.log(' FIND ONE RUN SUCCESSFULL in forgot password')
  // console.log('userrrr : ', user)

  if ( !user ) {
    return res
      .status( 400 )
      .json({
        message: "User does not exist",
        error: "User not found with forgot password",
      });
  } 

  const otp = Math.floor( Math.random() * 9000);
  const optExp = new Date();
  optExp.setMinutes(optExp.getMinutes() + 1); // 1m expiry
  
  try {
    user.otp = otp;
    user.otpExpire = optExp;
    await user.save();
  } catch ( err ) {
    // console.log(" Error while saving OTP ", err.message);
    return res.status( 500 ).json({
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
  } catch ( err ) {
    // console.log(" Error while sending OTP email ", err.message);
    return res.status( 500 ).json({
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
