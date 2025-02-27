const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    rental_period: {
      start_date: { type: Date, required: true },
      end_date: { type: Date, required: true },
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Canceled"],
      default: "Pending",
    },
    payment_status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    security_deposit_paid: {
      type: Boolean,
      default: false,
    },
    cancellation_reason: {
      type: String,
      default: "",
    },
    points_earned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
