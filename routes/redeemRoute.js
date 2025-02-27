const express = require("express");
const router = express.Router();
const {
  redeemPoints,
  getRedeemHistory,
  approveRedeemRequest,
} = require("../controller/redeemController");
const userAuth = require('../middleware/UserAuth.js');

// **User Routes**
router.post("/", userAuth, redeemPoints);
router.get("/history", userAuth, getRedeemHistory);

// **Admin Routes**
router.put("/approve/:id", userAuth, approveRedeemRequest);

module.exports = router;
