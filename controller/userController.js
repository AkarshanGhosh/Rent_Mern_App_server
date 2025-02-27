const User = require("../models/User");
const bcrypt = require("bcryptjs");

// **Get User Profile**
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Update User Profile**
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, phone_number, avatar } = req.body;
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    user.phone_number = phone_number || user.phone_number;
    user.avatar = avatar || user.avatar;

    await user.save();
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Change Password**
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Redeem Points**
exports.redeemPoints = async (req, res) => {
  try {
    const { points } = req.body;
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.nextRedeemable < points) {
      return res.status(400).json({ message: "Not enough redeemable points" });
    }

    user.nextRedeemable -= points;
    user.redeemed += points;
    await user.save();

    res.status(200).json({ message: "Points redeemed successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
