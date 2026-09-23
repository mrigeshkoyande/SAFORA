const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');
const { uploadFile, deleteFile } = require('../services/cloudinary.service');
const fs = require('fs');

// @route   POST /api/vault/upload
// @desc    Upload evidence to vault
// @access  Private
const uploadEvidence = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded', 400);

    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);
    
    // Upload to Cloudinary
    const result = await uploadFile(req.file.path, 'angel_ai_evidence');
    
    // Remove local file
    fs.unlinkSync(req.file.path);

    // Determine type from mimetype
    let fileType = 'Image';
    if (req.file.mimetype.startsWith('video/')) fileType = 'Video';
    if (req.file.mimetype.startsWith('audio/')) fileType = 'Audio';

    const evidence = await prisma.evidenceVault.create({
      data: {
        userId: user.id,
        fileType,
        cloudinaryUrl: result.secure_url,
        ...req.body,
      }
    });

    return sendSuccess(res, 'Evidence uploaded successfully', { evidence }, 201);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @route   GET /api/vault
// @desc    Get all evidence
// @access  Private
const getEvidence = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);

    const evidence = await prisma.evidenceVault.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return sendSuccess(res, 'Evidence retrieved', { evidence });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/vault/:id
// @desc    Delete evidence
// @access  Private
const deleteEvidence = async (req, res, next) => {
  try {
    const evidence = await prisma.evidenceVault.findUnique({ where: { id: req.params.id } });
    if (!evidence) return sendError(res, 'Evidence not found', 404);

    // Extract public_id from Cloudinary URL (basic implementation)
    const urlParts = evidence.cloudinaryUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `angel_ai_evidence/${filename.split('.')[0]}`;

    await deleteFile(publicId);
    
    await prisma.evidenceVault.delete({ where: { id: req.params.id } });

    return sendSuccess(res, 'Evidence deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadEvidence,
  getEvidence,
  deleteEvidence,
};
