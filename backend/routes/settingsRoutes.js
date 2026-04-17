const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, settingsController.getSettings);
router.put('/', auth, admin, settingsController.updateSettings);

module.exports = router;