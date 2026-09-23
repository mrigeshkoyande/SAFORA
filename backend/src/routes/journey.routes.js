const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const {
  startJourney,
  updateLocation,
  checkIn,
  endJourney,
  getHistory
} = require('../controllers/journey.controller');

router.use(verifyToken);

router.post('/start', startJourney);
router.post('/location', updateLocation);
router.post('/checkin', checkIn);
router.post('/end', endJourney);
router.get('/history', getHistory);

module.exports = router;
