const User = require("../models/User");
const bcrypt = require("bcryptjs");

// **Get User Profile**
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate the user ID
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// **Update User Profile**
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, phone_number, avatar, address } = req.body;
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields only if provided
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone_number = phone_number || user.phone_number;
    user.avatar = avatar || user.avatar;

    // Ensure address exists before updating (handles both new entry & updates)
    if (address) {
      user.address = {
        street: address.street || user.address?.street || "",
        city: address.city || user.address?.city || "",
        state: address.state || user.address?.state || "",
        country: address.country || user.address?.country || "",
        zip_code: address.zip_code || user.address?.zip_code || "",
      };
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
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
