const express = require("express");
const router = express.Router();
const {
  addReview,
  getItemReviews,
  deleteReview,
} = require("../controller/reviewController");
const { verifyUser, verifyAdmin } = require("../middleware/authMiddleware");

// **User Routes**
router.post("/", verifyUser, addReview);
router.get("/:itemId", getItemReviews);

// **Admin Routes**
router.delete("/:id", verifyAdmin, deleteReview);

module.exports = router;
