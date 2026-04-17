const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { auth, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', auth, admin, mediaController.getMedia);
router.post('/', auth, admin, upload.array('images'), mediaController.uploadMedia);
router.delete('/:filename', auth, admin, mediaController.deleteMedia);

module.exports = router;