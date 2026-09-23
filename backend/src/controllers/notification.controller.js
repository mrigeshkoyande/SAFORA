const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');

// @route   GET /api/notifications
// @desc    Get all notifications for user
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return sendSuccess(res, 'Notifications retrieved', { notifications });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/notifications/read
// @desc    Mark all or specific notification as read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);
    const { notificationId } = req.body; // optional

    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true }
      });
    }
    
    return sendSuccess(res, 'Notifications marked as read');
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/notifications
// @desc    Delete all notifications or specific one
// @access  Private
const deleteNotifications = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);
    const { notificationId } = req.body; // optional

    if (notificationId) {
      await prisma.notification.delete({ where: { id: notificationId } });
    } else {
      await prisma.notification.deleteMany({ where: { userId: user.id } });
    }
    
    return sendSuccess(res, 'Notifications deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotifications,
};
