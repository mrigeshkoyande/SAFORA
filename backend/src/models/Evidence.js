const mongoose = require('mongoose');
const CONSTANTS = require('../utils/constants');

const evidenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileType: {
      type: String,
      enum: Object.values(CONSTANTS.EVIDENCE_TYPES),
      required: true,
    },
    cloudinaryURL: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    encrypted: {
      type: Boolean,
      default: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Evidence', evidenceSchema);
