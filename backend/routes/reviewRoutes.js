const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, reviewController.getReviews);
router.delete('/:id', auth, admin, reviewController.deleteReview);
router.get('/reviews', auth, admin, reviewController.getReviews);
router.delete('/reviews/:id', auth, admin, reviewController.deleteReview);

module.exports = router;