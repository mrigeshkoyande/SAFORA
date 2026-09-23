const mongoose = require('mongoose');
const CONSTANTS = require('../utils/constants');

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    triggerType: {
      type: String,
      enum: Object.values(CONSTANTS.SOS_TRIGGER_TYPES),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.SOS_STATUS),
      default: CONSTANTS.SOS_STATUS.PENDING,
    },
    guardianNotified: {
      type: Boolean,
      default: false,
    },
    policeNotified: {
      type: Boolean,
      default: false,
    },
    ambulanceRequested: {
      type: Boolean,
      default: false,
    },
    audioRecordingURL: {
      type: String,
    },
    videoRecordingURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SOS', sosSchema);
