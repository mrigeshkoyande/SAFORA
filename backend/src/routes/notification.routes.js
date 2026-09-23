const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const {
  getNotifications,
  markAsRead,
  deleteNotifications
} = require('../controllers/notification.controller');

router.use(verifyToken);

router.get('/', getNotifications);
router.put('/read', markAsRead);
router.delete('/', deleteNotifications);

module.exports = router;
