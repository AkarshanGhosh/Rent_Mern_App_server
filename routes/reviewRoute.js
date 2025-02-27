const express = require("express");
const router = express.Router();
const {
  addReview,
  getItemReviews,
  deleteReview,
} = require("../controller/reviewController");
const userAuth = require('../middleware/UserAuth.js');

// **User Routes**
router.post("/", userAuth, addReview);
router.get("/:itemId", getItemReviews);

// **Admin Routes**
router.delete("/:id", userAuth, deleteReview);

module.exports = router;
