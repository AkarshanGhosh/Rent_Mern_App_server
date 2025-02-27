const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (userId) {
          const User = mongoose.model("User");
          const user = await User.findById(userId);
          return user && user.role === "provider";
        },
        message: "Only providers can upload items",
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Appliance", "Furniture", "Vehicle", "Gadget", "Other"],
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      default: ["https://cdn-icons-png.flaticon.com/512/16/16410.png"], // Default placeholder
    },
    rental_price: {
      type: Number,
      required: true,
      min: 0,
    },
    availability_status: {
      type: String,
      enum: ["Available", "Rented"],
      default: "Available",
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
    security_deposit: {
      type: Number,
      default: 0,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

// **Index for Geolocation Queries**
itemSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Item", itemSchema);
