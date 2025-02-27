const jwt = require("jsonwebtoken");
const User = require("../models/User");

// **Verify User (Token Required)**
exports.verifyUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verified.id).select("-password");

    if (!req.user) return res.status(401).json({ message: "Invalid Token" });

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token", error });
  }
};

// **Verify Admin (Only Admins Allowed)**
exports.verifyAdmin = async (req, res, next) => {
  try {
    await exports.verifyUser(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// **Verify Provider (Only Providers Allowed)**
exports.verifyProvider = async (req, res, next) => {
  try {
    await exports.verifyUser(req, res, async () => {
      if (req.user.role !== "provider") {
        return res.status(403).json({ message: "Access Denied: Providers Only" });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
