const express = require("express");
const router = express.Router();
const {
  createnewuser,
  verifyEmail,
  login,
} = require("../controllers/AuthController.js");
const { adminAuth, userAuth } = require("../middlewares/auth.js");

router.post("/rigesteruser", createnewuser);
router.get("/verify-email", verifyEmail);
router.post('/login', login);
router.get('/admin', adminAuth)
router.get('/basic', userAuth, (req, res) => res.send('User Route'))

module.exports = router;
