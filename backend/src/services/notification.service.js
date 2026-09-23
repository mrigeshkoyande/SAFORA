const prisma = require('../config/prisma');
const { sendPushNotification } = require('./firebase.service');

const createNotification = async (userId, title, message, type = 'System') => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    }
  });

  // Try to send push notification if user has a device token
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user && user.deviceToken) {
    try {
      await sendPushNotification(user.deviceToken, title, message);
    } catch (error) {
      console.error(`Failed to send push to ${userId}:`, error.message);
    }
  }

  return notification;
};

module.exports = {
  createNotification,
};
