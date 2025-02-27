const User = require("../models/User");

// **Get All Users (Admin Only)**
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Delete User (Admin Only)**
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Update User Role (Admin Only)**
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Add Points to User (Admin Only)**
exports.addPoints = async (req, res) => {
  try {
    const { points } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.points += points;
    user.nextRedeemable += points;
    await user.save();

    res.status(200).json({ message: "Points added successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
