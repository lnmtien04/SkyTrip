const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, admin } = require('../middleware/auth');

router.get('/overview', auth, admin, analyticsController.getOverview);
router.get('/revenue', auth, admin, analyticsController.getRevenueStats);
router.get('/views', auth, admin, analyticsController.getViewsStats);
router.get('/top-places', auth, admin, analyticsController.getTopPlaces);

module.exports = router;