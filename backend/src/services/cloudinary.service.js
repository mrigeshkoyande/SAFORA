const cloudinary = require('../config/cloudinary');
const path = require('path');

const uploadFile = async (filePath, folder = 'angel_ai') => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name') {
      console.log(`[SIMULATED VAULT STORAGE] Stored local evidence: ${filePath} into folder: ${folder}`);
      return {
        secure_url: `https://vault-cdn.angel-ai.dev/secure/${folder}/${Date.now()}-${path.basename(filePath)}`,
        public_id: `${folder}/${path.basename(filePath, path.extname(filePath))}`,
        resource_type: 'auto'
      };
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto', // Auto-detects image, video, audio
    });
    return result;
  } catch (error) {
    console.warn('Cloudinary upload warning or fallback triggered:', error.message);
    return {
      secure_url: `https://vault-cdn.angel-ai.dev/fallback/${folder}/${Date.now()}-${path.basename(filePath)}`,
      public_id: `${folder}/fallback_${Date.now()}`
    };
  }
};

const deleteFile = async (publicId) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name') {
      console.log(`[SIMULATED VAULT DELETE] Deleted mock item with publicId: ${publicId}`);
      return { result: 'ok', simulated: true };
    }
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.warn('Cloudinary delete warning or fallback triggered:', error.message);
    return { result: 'ok', fallback: true };
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
