const express = require("express");
const router = express.Router();
const {
  createnewuser,
  verifyEmail,
  login,
  user_forgotPassword,
  user_resetPassword,
} = require("../controllers/AuthController.js");
const { adminAuth, userAuth } = require("../middlewares/auth.js");

router.post("/rigesteruser", createnewuser);
router.get("/verify-email", verifyEmail);
router.post('/login', login);
router.get('/admin', adminAuth, (req, res) => res.send('Admin Route'))
router.get('/basic', userAuth, (req, res) => res.send('User Route'))
router.post('/forgotPassword', user_forgotPassword);
router.post('/resetPassword', user_resetPassword)

module.exports = router;
