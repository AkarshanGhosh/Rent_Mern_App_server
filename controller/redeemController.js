const Redeem = require("../models/Redeem");
const User = require("../models/User");

// **Redeem Points (User Only)**
exports.redeemPoints = async (req, res) => {
  try {
    const { points_redeemed, reward_type } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.nextRedeemable < points_redeemed) {
      return res.status(400).json({ message: "Not enough redeemable points" });
    }

    const redeemRequest = new Redeem({
      user: user._id,
      points_redeemed,
      reward_type,
      status: "Pending",
    });

    user.nextRedeemable -= points_redeemed;
    user.redeemed += points_redeemed;
    await user.save();
    await redeemRequest.save();

    res.status(201).json({ message: "Redeem request submitted", redeemRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get Redeem History (User)**
exports.getRedeemHistory = async (req, res) => {
  try {
    const redeems = await Redeem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(redeems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Approve/Decline Redeem Request (Admin Only)**
exports.approveRedeemRequest = async (req, res) => {
  try {
    const { status, coupon_code, discount_amount } = req.body;
    const redeem = await Redeem.findById(req.params.id);

    if (!redeem) {
      return res.status(404).json({ message: "Redeem request not found" });
    }

    redeem.status = status;

    if (status === "Approved") {
      if (redeem.reward_type === "Coupon") {
        redeem.reward_details.coupon_code = coupon_code;
      } else if (redeem.reward_type === "Website Discount") {
        redeem.reward_details.discount_amount = discount_amount;
      }
    }

    await redeem.save();
    res.status(200).json({ message: "Redeem request updated", redeem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
