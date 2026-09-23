const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const {
  createSOS,
  getSOSHistory,
  getSOS,
  updateSOS
} = require('../controllers/sos.controller');

router.use(verifyToken);

router.post('/', createSOS);
router.get('/', getSOSHistory);
router.get('/:id', getSOS);
router.put('/:id', updateSOS);

module.exports = router;
