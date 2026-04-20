const Booking = require('../models/Booking');
const Place = require('../models/Place');

// Tạo booking mới (người dùng) – dành cho tour du lịch
exports.createBooking = async (req, res) => {
  try {
    const {
       place,
      departureDate,
      adults,
      children,
      infants,
      pickupPoint,
      specialRequests,
      customerName,
      customerPhone,
      customerEmail,
      customerIdNumber,
    } = req.body;
    
    const userId = req.user?.id;
    const placeData = await Place.findById(place);
    if (!placeData) return res.status(404).json({ error: 'Tour not found' });

    const departure = new Date(departureDate);
    const duration = placeData.duration || 1;
    const endDate = new Date(departure);
    endDate.setDate(endDate.getDate() + duration - 1); // ngày kết thúc (nếu duration=3, khởi hành ngày 1 thì kết thúc ngày 3)
    
    // Tính tổng tiền: giá người lớn * số lượng + giá trẻ em * số lượng + giá em bé * số lượng
    const totalPrice = (placeData.priceAdult * adults) + (placeData.priceChild * children) + (placeData.priceInfant * infants);
    
    const booking = new Booking({
      user: userId,
      place,
      departureDate: departure,
      endDate: endDate,
      duration: duration,
      adults,
      children,
      infants,
      pickupPoint,
      specialRequests,
      customerName,
      customerPhone,
      customerEmail,
      customerIdNumber,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'later',
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách booking (admin: tất cả, user: của mình) có phân trang, tìm kiếm, lọc
exports.getBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const statusFilter = req.query.status;
    const skip = (page - 1) * limit;
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
    }
    if (statusFilter && statusFilter !== 'all') query.status = statusFilter;
    
    const bookings = await Booking.find(query)
  .populate('user', 'name email')
  .populate('place', 'name address priceAdult priceChild priceInfant') // thêm priceAdult,...
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
    const total = await Booking.countDocuments(query);
    res.json({
      bookings,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái booking (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa booking (admin)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await booking.deleteOne();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};