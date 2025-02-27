const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  redeemPoints
} = require("../controller/userController");
const userAuth = require('../middleware/UserAuth.js');

// **User Routes**
router.get("/profile", userAuth, getUserProfile);
router.put("/update", userAuth, updateUserProfile);
router.put("/change-password", userAuth, changePassword);
router.put("/redeem", userAuth, redeemPoints);

module.exports = router;
