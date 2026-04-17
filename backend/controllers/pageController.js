const Page = require('../models/Page');

// Lấy danh sách trang (phân trang, tìm kiếm)
exports.getPages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;
    let query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    const pages = await Page.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Page.countDocuments(query);
    res.json({
      pages,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết trang
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id).populate('author', 'name');
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo trang mới
exports.createPage = async (req, res) => {
  try {
    const { title, slug, content, excerpt, image, status } = req.body;
    const existing = await Page.findOne({ slug });
    if (existing) return res.status(400).json({ error: 'Slug already exists' });
    const page = new Page({
      title,
      slug,
      content,
      excerpt,
      image,
      status: status || 'draft',
      author: req.user._id
    });
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trang
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, image, status } = req.body;
    // Kiểm tra slug trùng (trừ chính nó)
    if (slug) {
      const existing = await Page.findOne({ slug, _id: { $ne: id } });
      if (existing) return res.status(400).json({ error: 'Slug already exists' });
    }
    const page = await Page.findByIdAndUpdate(id, {
      title,
      slug,
      content,
      excerpt,
      image,
      status,
      updatedAt: Date.now()
    }, { new: true });
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa trang
exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findByIdAndDelete(id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};