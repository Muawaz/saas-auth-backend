const { addnewuser, finduserbyid } = require("../services/auth.js");

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
};
