const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, default: '' },
 lat: { type: Number, default: 0 },     // bỏ required
lng: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  ticketPrice: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
  priceAdult: { type: Number, default: 0 },
priceChild: { type: Number, default: 0 },
priceInfant: { type: Number, default: 0 },
availableDates: [{ type: Date }],
pickupPoints: [{ type: String }],
duration: { type: Number, default: 1 }, // số ngày của tour
});

module.exports = mongoose.model('Place', placeSchema);