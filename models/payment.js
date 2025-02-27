const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_status: {
      type: String,
      enum: ["Success", "Pending", "Failed"],
      default: "Pending",
    },
    payment_method: {
      type: String,
      enum: ["UPI", "Bank Transfer", "Credit Card", "Debit Card", "Wallet"],
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true,
    },
    security_deposit_refunded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
