const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const guardianRoutes = require('./guardian.routes');
const sosRoutes = require('./sos.routes');
const journeyRoutes = require('./journey.routes');
const vaultRoutes = require('./vault.routes');
const escapeRoutes = require('./escape.routes');
const notificationRoutes = require('./notification.routes');
const mapRoutes = require('./map.routes');
const dummyCallRoutes = require('./dummyCall.routes');

router.use('/auth', authRoutes);
router.use('/guardian', guardianRoutes);
router.use('/sos', sosRoutes);
router.use('/journey', journeyRoutes);
router.use('/vault', vaultRoutes);
router.use('/escape', escapeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/map', mapRoutes);
router.use('/dummy-call', dummyCallRoutes);

module.exports = router;
