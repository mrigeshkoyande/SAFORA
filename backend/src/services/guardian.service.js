const prisma = require('../config/prisma');
const CONSTANTS = require('../utils/constants');

const checkGuardianLimit = async (userId) => {
  const count = await prisma.guardian.count({ where: { userId } });
  if (count >= CONSTANTS.MAX_GUARDIANS) {
    throw new Error(`Maximum limit of ${CONSTANTS.MAX_GUARDIANS} guardians reached.`);
  }
  return true;
};

const checkDuplicateGuardian = async (userId, phone) => {
  const existing = await prisma.guardian.findFirst({ where: { userId, phone } });
  if (existing) {
    throw new Error('Guardian with this phone number already exists.');
  }
  return false;
};

module.exports = {
  checkGuardianLimit,
  checkDuplicateGuardian,
};
