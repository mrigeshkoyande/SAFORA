const CONSTANTS = {
  MAX_GUARDIANS: 5,
  SOS_STATUS: {
    PENDING: 'Pending',
    ACTIVE: 'Active',
    RESOLVED: 'Resolved',
  },
  JOURNEY_STATUS: {
    STARTED: 'Started',
    SAFE: 'Safe',
    SOS_TRIGGERED: 'SOS Triggered',
    COMPLETED: 'Completed',
  },
  EVIDENCE_TYPES: {
    IMAGE: 'Image',
    VIDEO: 'Video',
    AUDIO: 'Audio',
  },
  SOS_TRIGGER_TYPES: {
    POWER_BUTTON: 'Power Button',
    SHAKE_DEVICE: 'Shake Device',
    SOS_BUTTON: 'SOS Button',
    SILENT_SOS: 'Silent SOS',
    VOICE_COMMAND: 'Voice Command',
    GUARDIAN_TIMEOUT: 'Guardian Timeout',
  }
};

module.exports = CONSTANTS;
