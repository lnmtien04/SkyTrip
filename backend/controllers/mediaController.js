const fs = require('fs');
const path = require('path');

exports.getMedia = async (req, res) => {
  const uploadDir = path.join(__dirname, '../uploads');
  try {
    if (!fs.existsSync(uploadDir)) return res.json([]);
    const files = fs.readdirSync(uploadDir);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadMedia = (req, res) => {
  if (!req.files) return res.status(400).json({ error: 'No files uploaded' });
  const fileNames = req.files.map(f => f.filename);
  res.json(fileNames);
};

exports.deleteMedia = async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};