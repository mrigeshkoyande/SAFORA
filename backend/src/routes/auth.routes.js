const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const {
  registerUser,
  getProfile,
  updateProfile,
  deleteAccount,
  logout
} = require('../controllers/auth.controller');

// All auth routes require valid Firebase token
router.use(verifyToken);

router.post('/register', registerUser);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteAccount);
router.post('/logout', logout);

module.exports = router;
