const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUserData,
} = require("../controller/authController");
const userAuth = require('../middleware/UserAuth.js');

// **User Authentication Routes**
router.post("/register", signup);
router.post("/login", login);
router.get("/me", userAuth, getUserData);

module.exports = router;
