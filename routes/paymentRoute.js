const express = require("express");
const router = express.Router();
const {
  processPayment,
  updatePaymentStatus,
  getPaymentById,
  getUserPayments,
  refundSecurityDeposit,
} = require("../controller/paymentController");
const userAuth = require('../middleware/UserAuth.js');

// **User Routes**
router.post("/", userAuth, processPayment);
router.get("/user", userAuth, getUserPayments);
router.get("/:id", userAuth, getPaymentById);

// **Admin Routes**
router.put("/status/:id", userAuth, updatePaymentStatus);
router.put("/refund/:id", userAuth, refundSecurityDeposit);

module.exports = router;
