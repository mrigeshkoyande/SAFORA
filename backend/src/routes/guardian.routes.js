const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const {
  addGuardian,
  listGuardians,
  editGuardian,
  deleteGuardian
} = require('../controllers/guardian.controller');

router.use(verifyToken);

router.post('/', addGuardian);
router.get('/', listGuardians);
router.put('/:id', editGuardian);
router.delete('/:id', deleteGuardian);

module.exports = router;
