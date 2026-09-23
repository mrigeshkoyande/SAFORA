const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');

// @route   POST /api/auth/register
// @desc    Register or login a user (Syncs Firebase User to PostgreSQL)
// @access  Private (Firebase Token Required)
const registerUser = async (req, res, next) => {
  try {
    const { firebaseUID, email, phone_number } = req.user;
    const { fullName, phone } = req.body;

    let user = await prisma.user.findUnique({
      where: { firebaseUID }
    });

    let isNew = false;
    if (!user) {
      isNew = true;
      user = await prisma.user.create({
        data: {
          firebaseUID,
          email,
          phone: phone || phone_number || '',
          fullName: fullName || '',
        }
      });
    }

    return sendSuccess(res, 'User successfully authenticated and synced', { user }, isNew ? 201 : 200);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUID: req.user.firebaseUID }
    });
    if (!user) return sendError(res, 'User not found', 404);
    
    return sendSuccess(res, 'Profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const updateData = req.body;
    
    // Prevent sensitive fields from being updated directly here
    delete updateData.firebaseUID;
    delete updateData.email;
    delete updateData.id;
    
    const user = await prisma.user.update({
      where: { firebaseUID: req.user.firebaseUID },
      data: updateData
    });

    if (!user) return sendError(res, 'User not found', 404);
    
    return sendSuccess(res, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/auth/profile
// @desc    Delete user account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: { firebaseUID: req.user.firebaseUID }
    });
    if (!user) return sendError(res, 'User not found', 404);
    
    return sendSuccess(res, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user (clear device token)
// @access  Private
const logout = async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { firebaseUID: req.user.firebaseUID },
      data: { deviceToken: null }
    });
    return sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  getProfile,
  updateProfile,
  deleteAccount,
  logout,
};
