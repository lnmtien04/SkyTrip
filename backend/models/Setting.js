const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'SkyTrip' },
  siteDescription: { type: String, default: 'Trang web du lịch hàng đầu' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  bannerTitle: { type: String, default: 'Khám phá Việt Nam' },
  bannerSubtitle: { type: String, default: 'Trải nghiệm tuyệt vời' },
  contactEmail: { type: String, default: 'contact@skytrip.com' },
  contactPhone: { type: String, default: '1900 1234' },
  contactAddress: { type: String, default: 'Hà Nội, Việt Nam' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  itemsPerPage: { type: Number, default: 10 },
  showRating: { type: Boolean, default: true },
  showComments: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  theme: { type: String, default: 'light' }, // light / dark
  primaryColor: { type: String, default: '#f97316' },
  metaTitle: { type: String, default: 'SkyTrip - Du lịch Việt Nam' },
  metaDescription: { type: String, default: 'Trải nghiệm du lịch đỉnh cao' },
  footerCopyright: { type: String, default: '© 2025 SkyTrip. All rights reserved.' },
  footerContent: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Setting', settingSchema);