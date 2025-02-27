const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  addPoints
} = require("../controller/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

// **Admin Routes**
router.get("/all", verifyAdmin, getAllUsers);
router.delete("/:id", verifyAdmin, deleteUser);
router.put("/role/:id", verifyAdmin, updateUserRole);
router.put("/points/:id", verifyAdmin, addPoints);

module.exports = router;
