const mongoose = require('mongoose');
const CONSTANTS = require('../utils/constants');

const journeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },
    destination: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },
    expectedArrival: {
      type: Date,
      required: true,
    },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    guardianWatching: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guardian',
      },
    ],
    checkInTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.JOURNEY_STATUS),
      default: CONSTANTS.JOURNEY_STATUS.STARTED,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Journey', journeySchema);
