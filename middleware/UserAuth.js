const jwt = require("jsonwebtoken");
const User = require("../models/User");

const UserAuth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Authorization header is missing. Please log in again." });
        }

        // ✅ Log the full authorization header
        console.log("Authorization Header:", authHeader);

        // Token should be in the format "Bearer <token>"
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Authorization token is missing. Please log in again." });
        }

        // ✅ Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decodedToken); // Debugging log

        if (!decodedToken.id) {
            return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
        }

        // ✅ Fetch the user from the database
        const user = await User.findById(decodedToken.id).select("-password"); // Exclude password for security

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found. Invalid token." });
        }

        // ✅ Attach the user object to the request
        req.user = user;

        console.log("Authenticated User:", req.user); // Debugging

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ success: false, message: "Authentication failed: " + error.message });
    }
};

module.exports = UserAuth;
