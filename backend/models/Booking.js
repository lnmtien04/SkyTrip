const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  // Thông tin khách hàng
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  customerIdNumber: { type: String }, // CCCD/Passport
  // Thông tin tour
departureDate: { type: Date, required: true },
endDate: { type: Date },
duration: { type: Number, default: 1 },
adults: { type: Number, required: true, min: 0 },
children: { type: Number, default: 0, min: 0 },
infants: { type: Number, default: 0, min: 0 },
pickupPoint: { type: String },
customerIdNumber: { type: String },
  // Trạng thái
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['later', 'vnpay', 'bank'], default: 'later' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);