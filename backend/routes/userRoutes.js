const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, userController.getUsers);
router.post('/', auth, admin, userController.createUser);
router.put('/:id/role', auth, admin, userController.updateUserRole);
router.put('/:id/toggle-active', auth, admin, userController.toggleUserActive);
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router;