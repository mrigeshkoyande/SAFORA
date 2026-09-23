const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');

// @route   POST /api/dummy-call
// @desc    Save Dummy Call Settings
// @access  Private
const saveSettings = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);
    
    // Upsert dummy call settings
    const dummyCall = await prisma.dummyCall.upsert({
      where: { userId: user.id },
      update: req.body,
      create: {
        userId: user.id,
        ...req.body
      }
    });

    return sendSuccess(res, 'Dummy call settings saved', { dummyCall });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/dummy-call
// @desc    Get Dummy Call Settings
// @access  Private
const getSettings = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);

    const dummyCall = await prisma.dummyCall.findUnique({ where: { userId: user.id } });
    
    if (!dummyCall) return sendSuccess(res, 'No settings found', { dummyCall: null });
    
    return sendSuccess(res, 'Dummy call settings retrieved', { dummyCall });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveSettings,
  getSettings,
};
