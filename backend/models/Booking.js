const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  customerIdNumber: { type: String },
  departureDate: { type: Date, required: true },
  endDate: { type: Date },
  duration: { type: Number, default: 1 },
  adults: { type: Number, required: true, min: 0 },
  children: { type: Number, default: 0, min: 0 },
  infants: { type: Number, default: 0, min: 0 },
  pickupPoint: { type: String },
  totalPrice: { type: Number, required: true, default: 0 },   // ✅ THÊM DÒNG NÀY
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['later', 'vnpay', 'bank'], default: 'later' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);