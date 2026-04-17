const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, admin } = require('../middleware/auth');

// User routes (cần đăng nhập)
router.post('/', auth, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getBookings); // lấy booking của user

// Admin routes
router.get('/', auth, admin, bookingController.getBookings);
router.put('/:id', auth, admin, bookingController.updateBookingStatus);
router.delete('/:id', auth, admin, bookingController.deleteBooking);

module.exports = router;