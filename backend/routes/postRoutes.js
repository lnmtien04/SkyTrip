const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, postController.getPosts);
router.post('/', auth, admin, postController.createPost);
router.put('/:id', auth, admin, postController.updatePost);
router.delete('/:id', auth, admin, postController.deletePost);
router.put('/:id/toggle-status', auth, admin, postController.togglePostStatus);

module.exports = router;