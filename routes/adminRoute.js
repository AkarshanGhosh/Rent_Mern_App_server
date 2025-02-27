const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  addPoints
} = require("../controller/adminController");
const userAuth = require('../middleware/UserAuth.js');

// **Admin Routes**
router.get("/all", userAuth, getAllUsers);
router.delete("/:id", userAuth, deleteUser);
router.put("/role/:id", userAuth, updateUserRole);
router.put("/points/:id", userAuth, addPoints);

module.exports = router;
