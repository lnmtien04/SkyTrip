const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, categoryController.getCategories);
router.post('/', auth, admin, categoryController.createCategory);
router.put('/:id', auth, admin, categoryController.updateCategory);
router.delete('/:id', auth, admin, categoryController.deleteCategory);

module.exports = router;