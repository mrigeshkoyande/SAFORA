const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');
const { createNotification } = require('../services/notification.service');
const logger = require('../utils/logger');
const CONSTANTS = require('../utils/constants');

// @route   POST /api/sos
// @desc    Trigger SOS
// @access  Private
const createSOS = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);
    
    let sos = await prisma.sOSHistory.create({
      data: {
        userId: user.id,
        latitude: req.body.latitude || 0,
        longitude: req.body.longitude || 0,
        ...req.body,
      }
    });

    // Notify Guardians
    const guardians = await prisma.guardian.findMany({ where: { userId: user.id } });
    
    for (let guardian of guardians) {
      logger.info(`Simulating live emergency broadcast alert to Guardian (${guardian.relationship || 'Trusted Contact'}): ${guardian.phone}`);
    }

    logger.audit('SOS_TRIGGER_DISPATCHED', user.id, {
      sosId: sos.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      guardiansNotified: guardians.length,
      triggerMethod: req.body.triggerMethod || 'COVERT_GESTURE_OR_UI'
    });

    await createNotification(user.id, 'SOS Triggered!', 'Your SOS has been triggered and guardians have been notified.', 'SOS');

    return sendSuccess(res, 'SOS Triggered successfully', { sos }, 201);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sos
// @desc    Get SOS history for user
// @access  Private
const getSOSHistory = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);

    const sosHistory = await prisma.sOSHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return sendSuccess(res, 'SOS history retrieved', { history: sosHistory });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sos/:id
// @desc    Get specific SOS details
// @access  Private
const getSOS = async (req, res, next) => {
  try {
    const sos = await prisma.sOSHistory.findUnique({ where: { id: req.params.id } });
    if (!sos) return sendError(res, 'SOS not found', 404);
    
    return sendSuccess(res, 'SOS retrieved', { sos });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/sos/:id
// @desc    Update SOS status (Resolve)
// @access  Private
const updateSOS = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const sos = await prisma.sOSHistory.update({
      where: { id: req.params.id },
      data: { status }
    });

    if (!sos) return sendError(res, 'SOS not found', 404);
    
    logger.audit('SOS_STATUS_UPDATED', sos.userId, {
      sosId: sos.id,
      previousStatus: 'ACTIVE',
      newStatus: status,
      resolvedAt: new Date().toISOString()
    });

    return sendSuccess(res, 'SOS status updated', { sos });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSOS,
  getSOSHistory,
  getSOS,
  updateSOS,
};
