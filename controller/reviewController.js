const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Item = require("../models/Item");
const User = require("../models/User");

// **Add Review & Rating (Renter Only)**
exports.addReview = async (req, res) => {
  try {
    const { itemId, rating, review_text } = req.body;
    const renter = req.user.id;

    // Check if the user has booked this item
    const booking = await Booking.findOne({ item: itemId, renter });
    if (!booking) {
      return res.status(403).json({ message: "You must rent this item before reviewing it" });
    }

    const newReview = new Review({
      renter,
      item: itemId,
      rating,
      review_text,
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully", newReview });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get Reviews for an Item**
exports.getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ item: itemId }).populate("renter", "username");
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Delete Review (Admin Only)**
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await review.remove();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
