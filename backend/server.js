const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors({ origin: 'https://skytrip-frontend.onrender.com', credentials: true }));
app.use(express.json());

// Kiểm tra giá trị biến môi trường (sẽ in ra log khi chạy)
console.log('MONGODB_URI from env:', process.env.MONGODB_URI);

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Route kiểm tra
app.get('/', (req, res) => {
  res.json({ message: 'SkyTrip API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});