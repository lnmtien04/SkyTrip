const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, placeController.getPlaces);
router.post('/', auth, admin, placeController.createPlace);
router.put('/:id', auth, admin, placeController.updatePlace);
router.delete('/:id', auth, admin, placeController.deletePlace);
router.put('/:id/toggle-status', auth, admin, placeController.togglePlaceStatus);

module.exports = router;