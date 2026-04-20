const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://skytrip.onrender.com',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'https://skytrip-frontend.onrender.com'  // THÊM DÒNG NÀY
  ],
  credentials: true
}));

app.use(express.json());

console.log('MONGODB_URI from env:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // CHỈ MỘT LẦN
const mediaRoutes = require('./routes/mediaRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const statsRoutes = require('./routes/statsRoutes');
const pageRoutes = require('./routes/pageRoutes');
const publicRoutes = require('./routes/publicRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
//
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/places', placeRoutes);
app.use('/api/admin/posts', postRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/bookings', bookingRoutes);
app.use('/api/admin/reviews', reviewRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/stats', statsRoutes);
app.use('/api/admin/pages', pageRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'SkyTrip API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});