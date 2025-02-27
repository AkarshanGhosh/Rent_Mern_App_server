const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "provider"],
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: "",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    rentalHistory: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        rentedAt: { type: Date, default: Date.now },
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    points: {
      type: Number,
      default: 0, // Lifetime points, only increases
      min: 0,
    },
    nextRedeemable: {
      type: Number,
      default: 0, // Points that can be redeemed
      min: 0,
    },
    redeemed: {
      type: Number,
      default: 0, // Tracks redeemed points
      min: 0,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);
 