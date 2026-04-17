const Setting = require('../models/Setting');

// Lấy cài đặt (chỉ có 1 document)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Tạo mới nếu chưa có
      settings = new Setting();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật cài đặt
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }
    // Cập nhật các trường gửi lên
    Object.keys(req.body).forEach(key => {
      if (settings[key] !== undefined) {
        settings[key] = req.body[key];
      }
    });
    settings.updatedAt = Date.now();
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};