const Place = require('../models/Place');
const User = require('../models/User');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const fs = require('fs');
const path = require('path');

exports.getStats = async (req, res) => {
  try {
    const places = await Place.countDocuments();
    const users = await User.countDocuments();
    const posts = await Post.countDocuments();
    const reviews = await Review.countDocuments();
    const bookings = await Booking.countDocuments();
    
    // Đếm số file ảnh trong thư mục uploads
    const uploadDir = path.join(__dirname, '../uploads');
    let media = 0;
    if (fs.existsSync(uploadDir)) {
      media = fs.readdirSync(uploadDir).length;
    }
    
    res.json({ places, users, posts, reviews, bookings, media });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: err.message });
  }
};