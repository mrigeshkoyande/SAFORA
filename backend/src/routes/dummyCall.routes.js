const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const {
  saveSettings,
  getSettings
} = require('../controllers/dummyCall.controller');

router.use(verifyToken);

router.post('/', saveSettings);
router.get('/', getSettings);

module.exports = router;
