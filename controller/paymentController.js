const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");

// **Process Payment for Booking**
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, amount, payment_method, transaction_id } = req.body;
    const user = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.renter.toString() !== user) {
      return res.status(403).json({ message: "Unauthorized payment attempt" });
    }

    const newPayment = new Payment({
      user,
      booking: bookingId,
      amount,
      payment_method,
      transaction_id,
      payment_status: "Pending",
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment initiated", newPayment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Update Payment Status**
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment_status } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.payment_status = payment_status;
    await payment.save();

    res.status(200).json({ message: "Payment status updated", payment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get Payment Details by ID**
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get All Payments of a User**
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).populate("booking");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Refund Security Deposit (Admin Only)**
exports.refundSecurityDeposit = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.security_deposit_refunded = true;
    await payment.save();

    res.status(200).json({ message: "Security deposit refunded", payment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
