const express = require("express");
const router = express.Router();
const {
  processPayment,
  updatePaymentStatus,
  getPaymentById,
  getUserPayments,
  refundSecurityDeposit,
} = require("../controller/paymentController");
const { verifyUser, verifyAdmin } = require("../middleware/authMiddleware");

// **User Routes**
router.post("/", verifyUser, processPayment);
router.get("/user", verifyUser, getUserPayments);
router.get("/:id", verifyUser, getPaymentById);

// **Admin Routes**
router.put("/status/:id", verifyAdmin, updatePaymentStatus);
router.put("/refund/:id", verifyAdmin, refundSecurityDeposit);

module.exports = router;
