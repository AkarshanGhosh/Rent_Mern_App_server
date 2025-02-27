const express = require("express");
const router = express.Router();
const {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../controller/notificationController");
const { verifyUser, verifyAdmin } = require("../middleware/authMiddleware");

// **User Routes**
router.get("/", verifyUser, getUserNotifications);
router.put("/:id/read", verifyUser, markNotificationAsRead);
router.delete("/:id", verifyUser, deleteNotification);

// **Admin/System Routes**
router.post("/", verifyAdmin, sendNotification);

module.exports = router;
