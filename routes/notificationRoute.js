const express = require("express");
const router = express.Router();
const {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../controller/notificationController");
const userAuth = require('../middleware/UserAuth.js');

// **User Routes**
router.get("/", userAuth, getUserNotifications);
router.put("/:id/read", userAuth, markNotificationAsRead);
router.delete("/:id", userAuth, deleteNotification);

// **Admin/System Routes**
router.post("/", userAuth, sendNotification);

module.exports = router;
