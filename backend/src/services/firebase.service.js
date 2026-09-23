const admin = require('../config/firebase');

const sendPushNotification = async (deviceToken, title, body, data = {}) => {
  try {
    if (!admin) {
      console.log(`[SIMULATED FCM PUSH] To: ${deviceToken} | Title: "${title}" | Body: "${body}"`);
      return { success: true, simulated: true, messageId: `mock-fcm-${Date.now()}` };
    }
    const message = {
      notification: { title, body },
      data,
      token: deviceToken,
    };
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.error('Error sending FCM:', error.message || error);
    // Do not rethrow in production to prevent crashing calling services on dead device tokens
    return { success: false, error: error.message };
  }
};

const verifyIdToken = async (token) => {
  try {
    if (!admin) {
      if (process.env.NODE_ENV === 'development' || process.env.MOCK_AUTH === 'true') {
        return { uid: 'mock-dev-user-uid', email: 'mock@angel-ai.dev' };
      }
      throw new Error('Firebase Admin SDK not initialized');
    }
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendPushNotification,
  verifyIdToken,
};
