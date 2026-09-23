const mongoose = require('mongoose');

const dummyCallSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    callerName: {
      type: String,
      required: true,
      default: 'Mom',
    },
    callerNumber: {
      type: String,
      required: true,
      default: '+1234567890',
    },
    callerPhoto: {
      type: String, // URL to photo
    },
    scheduledTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DummyCall', dummyCallSchema);
