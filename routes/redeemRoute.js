const express = require("express");
const router = express.Router();
const {
  redeemPoints,
  getRedeemHistory,
  approveRedeemRequest,
} = require("../controller/redeemController");
const { verifyUser, verifyAdmin } = require("../middleware/authMiddleware");

// **User Routes**
router.post("/", verifyUser, redeemPoints);
router.get("/history", verifyUser, getRedeemHistory);

// **Admin Routes**
router.put("/approve/:id", verifyAdmin, approveRedeemRequest);

module.exports = router;
