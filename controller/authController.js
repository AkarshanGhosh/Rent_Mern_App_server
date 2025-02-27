const userModel = require("../models/User.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// **User Signup (With Password Hashing)**
exports.signup = async (req, res) => {
  try {
    const { username, email, phone_number, password } = req.body;

    let userExists = await userModel.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: "Email already registered" });

    userExists = await userModel.findOne({ username });
    if (userExists) return res.status(400).json({ success: false, message: "Username already taken" });

    // ✅ Hash password before saving
    console.log("Raw Password Before Hashing:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password Before Saving:", hashedPassword);

    const newUser = new userModel({
      username,
      email,
      phone_number,
      password: hashedPassword, // ✅ Securely stored hashed password
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// **User Login (With Password Hashing)**
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Step 1: Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("Login Attempt - Wrong Email:", email);
      return res.status(400).json({ success: false, message: "Wrong email" });
    }

    // ✅ Step 2: Log stored and entered passwords for debugging
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    // ✅ Step 3: Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }

    // ✅ Step 4: Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// **Reset Password (With Hashing)**
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Hash new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// **Get User Data (Protected Route)**
exports.getUserData = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header is missing" });
    }

    // Token should be in the format "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token is missing" });
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    // Fetch user from the database
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Respond with user data
    res.json({
      success: true,
      userData: {
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    }

    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
