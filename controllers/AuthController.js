const { addnewuser, finduserbyid } = require("../services/auth.js");
const User = require("../models/UserModel.js");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET

async function login(req, res, next) {
  const { email, password } = req.body;
  console.log('email1 : ', email);
  console.log('password1 : ', password);
  
  

  if ( !email || !password ) {
    return res.status( 400 ).json({
      message: "Email or Password not present",
    })
  }
  
  try {
    const user = await User.findOne({
      // attributes: ['email'], // Specify the columns you want
      where: { email: email }
    });
    console.log(' FIND ONE RUN SUCCESSFULL')
    console.log('userrrr : ', user)

    if ( !user ) {
      res.status( 401 ).json({
        message: "Login not successful",
        error: "User not found while logging in",
      });
    } else {

      // Comparing given password with hashed password
      let result = await bcrypt.compare(password, user.password);
      console.log('resulttt : ', result)

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
      message: "An error occurred in login",
      error: error.message,

    })
  }
}

async function createnewuser(req, res) {
  let userdata = req.body;
  console.log(userdata);

  if (!userdata.name || !userdata.email || !userdata.password) {
    res.status(401).json({ status: 0, message: "All fields are required" });
  }
  let newuser = await addnewuser(userdata, res);
  if (!newuser.success) {
    res.status(401).json({ status: 0, message: newuser.message });
  } else {
    res
      .status(201)
      .json({ status: 1, message: newuser.message, user: newuser.user });
  }
}

async function verifyEmail(req, res) {
  const { token, userId } = req.query;
  console.log(token, userId, "From kontroller");

  const user = await finduserbyid({ token, userId });
  console.log(user);

  if (!user || !token || !userId) {
    return res
      .status(401)
      .json({ status: 0, message: "Invalid token and userId" });
  }

  const statusCode = user.status ? user.status : 400;
  res
    .status(statusCode)
    .json({ status: user.status, message: user.message, user: user });
}

module.exports = {
  createnewuser,
  verifyEmail,
  login,
};
