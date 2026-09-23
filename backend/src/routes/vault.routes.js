const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const { upload } = require('../middleware/upload');
const {
  uploadEvidence,
  getEvidence,
  deleteEvidence
} = require('../controllers/vault.controller');

router.use(verifyToken);

router.post('/upload', upload.single('file'), uploadEvidence);
router.get('/', getEvidence);
router.delete('/:id', deleteEvidence);

module.exports = router;
