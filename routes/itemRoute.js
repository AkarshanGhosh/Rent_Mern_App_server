const express = require("express");
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getItemsByCategory,
  searchItems
} = require("../controller/itemController");
const { verifyUser } = require("../middleware/authMiddleware");

// **Public Routes**
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.get("/category/:category", getItemsByCategory);
router.get("/search", searchItems);

// **Provider Routes**
router.post("/", verifyUser, createItem);
router.put("/:id", verifyUser, updateItem);
router.delete("/:id", verifyUser, deleteItem);

module.exports = router;
