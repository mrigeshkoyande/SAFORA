const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');
const CONSTANTS = require('../utils/constants');
const logger = require('../utils/logger');

// @route   POST /api/journey/start
// @desc    Start a new journey
// @access  Private
const startJourney = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    
    const journey = await prisma.journey.create({
      data: {
        userId: user.id,
        startLatitude: req.body.startLocation?.latitude || 0,
        startLongitude: req.body.startLocation?.longitude || 0,
        startAddress: req.body.startLocation?.address || 'Current Location',
        destLatitude: req.body.destination?.latitude || 0,
        destLongitude: req.body.destination?.longitude || 0,
        destAddress: req.body.destination?.address || 'Destination',
        expectedArrival: new Date(req.body.expectedArrival || Date.now() + 3600000),
        status: CONSTANTS.JOURNEY_STATUS.STARTED,
      }
    });

    logger.audit('JOURNEY_STARTED', user.id, {
      journeyId: journey.id,
      startAddress: journey.startAddress,
      destAddress: journey.destAddress,
      expectedArrival: journey.expectedArrival
    });

    return sendSuccess(res, 'Journey started', { journey }, 201);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/journey/location
// @desc    Update live location
// @access  Private
const updateLocation = async (req, res, next) => {
  try {
    const { journeyId, latitude, longitude } = req.body;
    
    const journey = await prisma.journey.update({
      where: { id: journeyId },
      data: { 
        currentLatitude: latitude, 
        currentLongitude: longitude 
      }
    });

    if (!journey) return sendError(res, 'Journey not found', 404);
    
    return sendSuccess(res, 'Location updated', { journey });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/journey/checkin
// @desc    Check-in during journey
// @access  Private
const checkIn = async (req, res, next) => {
  try {
    const { journeyId } = req.body;
    
    const journey = await prisma.journey.update({
      where: { id: journeyId },
      data: { checkInTime: new Date() }
    });

    if (!journey) return sendError(res, 'Journey not found', 404);
    
    logger.audit('JOURNEY_CHECK_IN', journey.userId, {
      journeyId: journey.id,
      checkInTime: journey.checkInTime
    });

    return sendSuccess(res, 'Checked in safely', { journey });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/journey/end
// @desc    End journey safely
// @access  Private
const endJourney = async (req, res, next) => {
  try {
    const { journeyId } = req.body;
    
    const journey = await prisma.journey.update({
      where: { id: journeyId },
      data: { status: CONSTANTS.JOURNEY_STATUS.COMPLETED }
    });

    if (!journey) return sendError(res, 'Journey not found', 404);
    
    logger.audit('JOURNEY_COMPLETED', journey.userId, {
      journeyId: journey.id,
      completedAt: new Date().toISOString(),
      status: CONSTANTS.JOURNEY_STATUS.COMPLETED
    });

    return sendSuccess(res, 'Journey ended safely', { journey });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/journey/history
// @desc    Get journey history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    const history = await prisma.journey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return sendSuccess(res, 'Journey history retrieved', { history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startJourney,
  updateLocation,
  checkIn,
  endJourney,
  getHistory,
};
