const User = require('../models/User');
const Place = require('../models/Place');
const Post = require('../models/Post');
const Booking = require('../models/Booking');

function timeAgo(date) {
  if (!date) return 'vừa xong';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'vài giây trước';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} tuần trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;
  const years = Math.floor(days / 365);
  return `${years} năm trước`;
}

exports.getDashboard = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const places = await Place.countDocuments();
    const posts = await Post.countDocuments();
    const bookings = await Booking.countDocuments();
    const views = bookings * 10; // Tạm tính lượt xem từ booking

    const chartData = [
      { date: '07/04', visits: 420 }, { date: '08/04', visits: 380 },
      { date: '09/04', visits: 510 }, { date: '10/04', visits: 490 },
      { date: '11/04', visits: 600 }, { date: '12/04', visits: 720 },
      { date: '13/04', visits: 810 }
    ];

    // Lấy hoạt động gần đây từ các collection
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(2).lean();
    const recentPlaces = await Place.find().sort({ createdAt: -1 }).limit(2).lean();
    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(2).lean();

    const activities = [];
    recentUsers.forEach(u => activities.push({ user: u.name || u.email, action: 'đăng ký tài khoản mới', time: timeAgo(u.createdAt), createdAt: u.createdAt }));
    recentPlaces.forEach(p => activities.push({ user: 'Quản trị viên', action: `thêm địa điểm: ${p.name}`, time: timeAgo(p.createdAt), createdAt: p.createdAt }));
    recentPosts.forEach(p => activities.push({ user: 'Quản trị viên', action: `đăng bài viết: ${p.title || 'Bài viết mới'}`, time: timeAgo(p.createdAt), createdAt: p.createdAt }));

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentActivities = activities.slice(0, 6).map((act, idx) => ({ id: idx + 1, user: act.user, action: act.action, time: act.time }));

    res.json({
      stats: { users, locations: places, posts, views },
      chartData,
      recentActivities
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
};