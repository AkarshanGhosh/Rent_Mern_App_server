const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controller/bookingController");
const userAuth = require('../middleware/UserAuth.js');

// **Renter Routes**
router.post("/", userAuth, createBooking);
router.get("/user", userAuth, getUserBookings);
router.put("/cancel/:id", userAuth, cancelBooking);

// **Provider Routes**
router.get("/provider", userAuth, getProviderBookings);
router.put("/status/:id", userAuth, updateBookingStatus);

module.exports = router;
