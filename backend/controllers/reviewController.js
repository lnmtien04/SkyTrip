const Review = require('../models/Review');

// Lấy danh sách đánh giá (có phân trang, lọc theo place)
exports.getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const placeId = req.query.placeId;
    const skip = (page - 1) * limit;
    let query = {};
    if (placeId) query.place = placeId;
    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .populate('place', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Review.countDocuments(query);
    res.json({
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết một đánh giá
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('place', 'name');
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo đánh giá mới (yêu cầu đăng nhập)
exports.createReview = async (req, res) => {
  try {
    const { place, rating, comment } = req.body;
    const user = req.user._id;
    // Kiểm tra xem user đã đánh giá place này chưa
    const existing = await Review.findOne({ user, place });
    if (existing) return res.status(400).json({ error: 'Bạn đã đánh giá địa điểm này rồi' });
    const review = new Review({ user, place, rating, comment });
    await review.save();
    // Cập nhật rating trung bình cho place (có thể thực hiện ở placeController)
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật đánh giá (chỉ chủ sở hữu hoặc admin)
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    // Kiểm tra quyền: chỉ user tạo review hoặc admin mới được sửa
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền sửa đánh giá này' });
    }
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    review.updatedAt = new Date();
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa đánh giá (chỉ admin hoặc chủ sở hữu)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền xóa đánh giá này' });
    }
    await review.deleteOne();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy đánh giá mới nhất (cho trang chủ)
exports.getRecentReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name')
      .populate('place', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};