const express = require("express");
const router = express.Router();
const {
  createnewuser,
  verifyEmail,
  login,
} = require("../controllers/AuthController.js");

router.post("/rigesteruser", createnewuser);
router.get("/verify-email", verifyEmail);
router.post('/login', login);

module.exports = router;
