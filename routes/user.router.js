const express = require("express");
const router = express.Router();
const {
  createnewuser,
  verifyEmail,
} = require("../controllers/AuthController.js");

router.post("/rigesteruser", createnewuser);
router.get("/verify-email", verifyEmail);

module.exports = router;
