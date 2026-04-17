const Post = require('../models/Post');
const User = require('../models/User');

// Lấy danh sách bài viết (phân trang, tìm kiếm, lọc)
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (status !== 'all') {
      query.status = status;
    }
    
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết bài viết
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo bài viết mới
exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, image, status } = req.body;
    const author = req.user?._id; // lấy từ middleware auth
    const post = new Post({
      title,
      content,
      excerpt: excerpt || title.substring(0, 100),
      category,
      image: image || '',
      status: status || 'draft',
      author
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật bài viết
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedAt = new Date();
    const post = await Post.findByIdAndUpdate(id, updateData, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa bài viết
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thay đổi trạng thái (draft/published)
exports.togglePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.status = post.status === 'draft' ? 'published' : 'draft';
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};