const express = require('express');
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");

// Import Routes
const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const adminRoute = require("./routes/adminRoute.js");
const itemRoute = require("./routes/itemRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");
const paymentRoute = require("./routes/paymentRoute.js");
const redeemRoute = require("./routes/redeemRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const notificationRoute = require("./routes/notificationRoute.js");

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Base Route
app.get("/", (req, res) => res.send("API is running"));

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/items", itemRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/redeem", redeemRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/notifications", notificationRoute);

// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
