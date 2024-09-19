const express = require("express");
const router = express.Router();
const {
  createnewcompagin,
  deletecompagin,
  updatecompagin,
  getcompagins,
} = require("../controllers/compagincontroller.js");

router.post("/newcompagin", createnewcompagin);

router.delete("/deletecompagin/:id", deletecompagin);

router.patch("/updatecompagin/:id", updatecompagin);

router.get("/getcompagins/:id", getcompagins);

module.exports = router;
