const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUserData,
} = require("../controller/authController");
const { verifyUser } = require("../middleware/authMiddleware");

// **User Authentication Routes**
router.post("/register", signup);
router.post("/login", login);
router.get("/me", verifyUser, getUserData);

module.exports = router;
