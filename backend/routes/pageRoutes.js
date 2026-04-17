const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, pageController.getPages);
router.get('/:id', auth, admin, pageController.getPageById);
router.post('/', auth, admin, pageController.createPage);
router.put('/:id', auth, admin, pageController.updatePage);
router.delete('/:id', auth, admin, pageController.deletePage);

module.exports = router;