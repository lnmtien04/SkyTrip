const Booking = require('../models/Booking');
const Place = require('../models/Place');
const User = require('../models/User');
const Post = require('../models/Post');

// Thống kê doanh thu theo tháng (6 tháng gần nhất)
exports.getRevenueStats = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    
    const bookings = await Booking.find({
      status: 'completed',
      createdAt: { $gte: sixMonthsAgo }
    });
    
    const monthlyRevenue = {};
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = `${date.getMonth()+1}/${date.getFullYear()}`;
      monthlyRevenue[monthYear] = 0;
    }
    
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const monthYear = `${date.getMonth()+1}/${date.getFullYear()}`;
      if (monthlyRevenue[monthYear] !== undefined) {
        monthlyRevenue[monthYear] += booking.totalPrice || 0;
      }
    });
    
    const chartData = Object.entries(monthlyRevenue).reverse().map(([month, revenue]) => ({
      month,
      revenue
    }));
    
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thống kê lượt truy cập (từ posts và places views)
exports.getViewsStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    // Lấy dữ liệu từ Post và Place (giả sử có trường viewCount và createdAt)
    const places = await Place.find({ createdAt: { $gte: sevenDaysAgo } });
    const posts = await Post.find({ createdAt: { $gte: sevenDaysAgo } });
    
    const dailyViews = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyViews[dateStr] = 0;
    }
    
    places.forEach(place => {
      const dateStr = place.createdAt.toISOString().split('T')[0];
      if (dailyViews[dateStr] !== undefined) dailyViews[dateStr] += (place.viewCount || 0);
    });
    
    posts.forEach(post => {
      const dateStr = post.createdAt.toISOString().split('T')[0];
      if (dailyViews[dateStr] !== undefined) dailyViews[dateStr] += (post.views || 0);
    });
    
    const chartData = Object.entries(dailyViews).reverse().map(([date, views]) => ({
      date,
      views
    }));
    
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Top địa điểm được đặt nhiều nhất
exports.getTopPlaces = async (req, res) => {
  try {
    const topPlaces = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$place', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'places', localField: '_id', foreignField: '_id', as: 'place' } },
      { $unwind: '$place' },
      { $project: { name: '$place.name', bookings: '$count' } }
    ]);
    res.json(topPlaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tổng quan
exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const revenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenue[0]?.total || 0;
    
    res.json({
      totalUsers,
      totalPlaces,
      totalBookings,
      completedBookings,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};