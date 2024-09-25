const express = require("express");
const router = express.Router();
const { isopen } = require("../controllers/emailstatscontroller.js");

router.get("/isopen", isopen);

module.exports = router;
