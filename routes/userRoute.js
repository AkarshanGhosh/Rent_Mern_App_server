const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  redeemPoints
} = require("../controller/userController");
const { verifyUser } = require("../middleware/authMiddleware");

// **User Routes**
router.get("/profile", verifyUser, getUserProfile);
router.put("/update", verifyUser, updateUserProfile);
router.put("/change-password", verifyUser, changePassword);
router.put("/redeem", verifyUser, redeemPoints);

module.exports = router;
