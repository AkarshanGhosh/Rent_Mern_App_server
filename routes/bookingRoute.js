const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controller/bookingController");
const { verifyUser } = require("../middleware/authMiddleware");

// **Renter Routes**
router.post("/", verifyUser, createBooking);
router.get("/user", verifyUser, getUserBookings);
router.put("/cancel/:id", verifyUser, cancelBooking);

// **Provider Routes**
router.get("/provider", verifyUser, getProviderBookings);
router.put("/status/:id", verifyUser, updateBookingStatus);

module.exports = router;
