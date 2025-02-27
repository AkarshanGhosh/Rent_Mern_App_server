const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAuthenticatedUser,
} = require("../controller/authController");
const { verifyUser } = require("../middleware/authMiddleware");

// **User Authentication Routes**
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyUser, getAuthenticatedUser);

module.exports = router;
