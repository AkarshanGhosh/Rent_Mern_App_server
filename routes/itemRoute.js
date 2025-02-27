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
const userAuth = require('../middleware/UserAuth.js');

// **Public Routes**
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.get("/category/:category", getItemsByCategory);
router.get("/search", searchItems);

// **Provider Routes**
router.post("/", userAuth, createItem);
router.put("/:id", userAuth, updateItem);
router.delete("/:id", userAuth, deleteItem);

module.exports = router;
