const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const {
  chatWithCoach,
  getHistory
} = require('../controllers/escapeCoach.controller');

router.use(verifyToken);

router.post('/chat', chatWithCoach);
router.get('/history', getHistory);

module.exports = router;
