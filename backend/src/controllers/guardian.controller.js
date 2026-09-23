const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');
const { checkGuardianLimit, checkDuplicateGuardian } = require('../services/guardian.service');
const { createNotification } = require('../services/notification.service');
const logger = require('../utils/logger');

// @route   POST /api/guardian
// @desc    Add a new guardian
// @access  Private
const addGuardian = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);

    await checkGuardianLimit(user.id);
    await checkDuplicateGuardian(user.id, req.body.phone);

    const guardian = await prisma.guardian.create({
      data: {
        userId: user.id,
        ...req.body,
      }
    });
    
    logger.audit('GUARDIAN_ADDED', user.id, {
      guardianId: guardian.id,
      name: guardian.guardianName,
      priority: guardian.priority || 1,
      relationship: guardian.relationship || 'Friend'
    });

    await createNotification(user.id, 'Guardian Added', `${req.body.guardianName} was added as a guardian.`, 'Guardian');

    return sendSuccess(res, 'Guardian added successfully', { guardian }, 201);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/guardian
// @desc    Get all guardians
// @access  Private
const listGuardians = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    const guardians = await prisma.guardian.findMany({
      where: { userId: user.id },
      orderBy: { priority: 'asc' }
    });
    
    return sendSuccess(res, 'Guardians retrieved successfully', { guardians });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/guardian/:id
// @desc    Update a guardian
// @access  Private
const editGuardian = async (req, res, next) => {
  try {
    const guardian = await prisma.guardian.update({
      where: { id: req.params.id },
      data: req.body
    });

    if (!guardian) return sendError(res, 'Guardian not found', 404);
    
    logger.audit('GUARDIAN_UPDATED', guardian.userId, {
      guardianId: guardian.id,
      updatedFields: Object.keys(req.body)
    });

    return sendSuccess(res, 'Guardian updated successfully', { guardian });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/guardian/:id
// @desc    Delete a guardian
// @access  Private
const deleteGuardian = async (req, res, next) => {
  try {
    const guardian = await prisma.guardian.delete({
      where: { id: req.params.id }
    });
    if (!guardian) return sendError(res, 'Guardian not found', 404);
    
    logger.audit('GUARDIAN_REMOVED', guardian.userId, {
      guardianId: req.params.id,
      removedAt: new Date().toISOString()
    });

    return sendSuccess(res, 'Guardian deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addGuardian,
  listGuardians,
  editGuardian,
  deleteGuardian,
};
