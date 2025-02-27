const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Booking", "Payment", "Redeem", "Review", "System"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    related_id: {
      type: mongoose.Schema.Types.ObjectId, // ID of the related Booking, Payment, etc.
      default: null,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
