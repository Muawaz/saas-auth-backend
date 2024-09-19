const { addnewuser, finduserbyid } = require("../services/auth.js");
const User = require("../models/UserModel.js");

async function login(req, res, next) {
  const { email1, password1 } = req.body;
  console.log('email1 : ', email1);
  console.log('password1 : ', password1);
  
  

  if ( !email1 || !password1 ) {
    return res.status( 400 ).json({
      message: "Email or Password not present",
    })
  }

  console.log('beforeee  useerrrr : ');
  const user = await User.findOne({
    attributes: ['id', 'email', 'password'], // Specify the columns you want
    where: { email: email1, password: password1 }
  });
  console.log('useerrrr : ', user);
  
  try {
    const user = await User.findOne({
      attributes: ['id', 'email', 'password'], // Specify the columns you want
      where: { email: email1, password: password1 }
    });
    console.log(' FIND ONE RUN SUCCESSFULL')
    if ( !user ) {
      res.status( 401 ).json({
        message: "Login not successful",
        error: "User not found while logging in",
      });
    } else {
      res.status( 200 ).json({
        message: "Login successful",
        user,
      });
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
  let newuser = await addnewuser(userdata);
  res
    .status(201)
    .json({ status: 1, message: "User created successfully", user: newuser });
}

async function verifyEmail(req, res) {
  const { token, userId } = req.query;

  const user = await finduserbyid(userId);
  // const user = await User.findOne({ where: { id: userId } });

  if (!user || user.verificationToken !== token) {
    return res.status(400).json({ status: 0, message: "Invalid token" });
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({ status: 1, message: "Email verified successfully" });
}

module.exports = {
  createnewuser,
  verifyEmail,
  login,
};
