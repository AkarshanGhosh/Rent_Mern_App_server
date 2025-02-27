const mongoose = require("mongoose");

const redeemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points_redeemed: {
      type: Number,
      required: true,
      min: 1,
    },
    reward_type: {
      type: String,
      enum: ["Coupon", "Website Discount"],
      required: true,
    },
    reward_details: {
      coupon_code: {
        type: String,
        default: null, // Only for "Coupon" type rewards
      },
      discount_amount: {
        type: Number,
        default: 0, // Only for "Website Discount"
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Redeem", redeemSchema);
