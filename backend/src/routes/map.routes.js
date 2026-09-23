const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const {
  getPolice,
  getHospitals,
  getSafePlaces
} = require('../controllers/map.controller');

router.use(verifyToken);

router.get('/police', getPolice);
router.get('/hospitals', getHospitals);
router.get('/safe-places', getSafePlaces);

module.exports = router;
