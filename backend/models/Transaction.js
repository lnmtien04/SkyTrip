const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  orderInfo: { type: String },
  paymentMethod: { type: String, enum: ['vnpay', 'momo', 'bank'], default: 'vnpay' },
  transactionId: { type: String },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  responseCode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);