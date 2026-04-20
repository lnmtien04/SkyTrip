const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Post = require('../models/Post');
const Setting = require('../models/Setting');
const Review = require('../models/Review'); // thêm dòng này

// ==================== PLACES ====================
// Lấy địa điểm nổi bật (6 điểm)
router.get('/places/featured', async (req, res) => {
  try {
    const places = await Place.find({ isActive: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(8)
      .select('name image category address rating');
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách địa điểm công khai (phân trang, tìm kiếm, lọc)
router.get('/places', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const skip = (page - 1) * limit;
    let query = { isActive: true };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    const places = await Place.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Place.countDocuments(query);
    res.json({
      places,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy chi tiết một địa điểm (công khai)
router.get('/places/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: 'Not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== POSTS ====================
// Lấy bài viết mới nhất (3 bài)
router.get('/posts/recent', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('author', 'name')
      .select('title excerpt image createdAt author views');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách bài viết (phân trang, tìm kiếm)
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;
    let query = { status: 'published' };
    if (search) query.title = { $regex: search, $options: 'i' };
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name')
      .select('title excerpt image createdAt author views');
    const total = await Post.countDocuments(query);
    res.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy chi tiết bài viết (tăng lượt xem)
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')
      .populate('category', 'name');
    if (!post) return res.status(404).json({ error: 'Not found' });
    // Tăng lượt xem
    post.views = (post.views || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== REVIEWS ====================
// Lấy đánh giá gần đây (công khai)
// Lấy đánh giá gần đây (công khai)
router.get('/reviews/recent', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const limit = parseInt(req.query.limit) || 5;
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name')
      .populate('place', 'name');
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching recent reviews:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== SETTINGS ====================
// Lấy cài đặt công khai (không cần auth)
router.get('/settings', async (req, res) => {
  try {
    const Setting = require('../models/Setting');
    let settings = await Setting.findOne();
    if (!settings) {
      // Trả về settings mặc định nếu chưa có
      settings = {
        siteName: 'SkyTrip',
        siteDescription: 'Hệ thống đặt tour du lịch trực tuyến',
        contactEmail: 'contact@skytrip.com',
        contactPhone: '1900xxxx',
        address: 'Việt Nam'
      };
    }
    res.json(settings);
  } catch (err) {
    console.error('Error fetching public settings:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;