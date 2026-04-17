const Place = require('../models/Place');

// Lấy danh sách địa điểm (phân trang, tìm kiếm, lọc)
exports.getPlaces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const statusFilter = req.query.status;
    const skip = (page - 1) * limit;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (statusFilter === 'active') query.isActive = true;
    if (statusFilter === 'inactive') query.isActive = false;
    const places = await Place.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Place.countDocuments(query);
    res.json({ places, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết địa điểm
exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo địa điểm mới
exports.createPlace = async (req, res) => {
  try {
    const place = new Place(req.body);
    await place.save();
    res.status(201).json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật địa điểm
exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, req.body, { new: true });
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa địa điểm
exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findByIdAndDelete(id);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bật/tắt trạng thái hiển thị
exports.togglePlaceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    place.isActive = !place.isActive;
    await place.save();
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};