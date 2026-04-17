const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, dashboardController.getDashboard);

module.exports = router;