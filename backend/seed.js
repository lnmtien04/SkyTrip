const mongoose = require('mongoose');
const Place = require('./models/Place');
require('dotenv').config();

// Dữ liệu địa điểm mẫu (đã được bổ sung các trường cho tour)
const places = [
  {
    name: "Vịnh Hạ Long",
    description: "Kỳ quan thiên nhiên thế giới với hàng nghìn hòn đảo lớn nhỏ",
    category: "beach",
    address: "Thành phố Hạ Long, Quảng Ninh",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 20.95,
    lng: 107.07,
    rating: 4.9,
    isActive: true,
    priceAdult: 3500000,
    priceChild: 2000000,
    priceInfant: 500000,
    availableDates: [new Date('2026-05-10'), new Date('2026-05-15'), new Date('2026-05-20')],
    pickupPoints: ['Hà Nội', 'Hạ Long', 'Tự túc'],
  },
  {
    name: "Bãi biển Đà Nẵng",
    description: "Bãi biển đẹp với bờ cát trắng mịn",
    category: "beach",
    address: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 16.054,
    lng: 108.202,
    rating: 4.7,
    isActive: true,
    priceAdult: 2000000,
    priceChild: 1200000,
    priceInfant: 0,
    availableDates: [new Date('2026-05-12'), new Date('2026-05-18'), new Date('2026-05-25')],
    pickupPoints: ['Đà Nẵng', 'Hội An', 'Tự túc'],
  },
  {
    name: "Bãi biển Nha Trang",
    description: "Bãi biển với làn nước trong xanh",
    category: "beach",
    address: "Nha Trang, Khánh Hòa",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 12.238,
    lng: 109.196,
    rating: 4.6,
    isActive: true,
    priceAdult: 2500000,
    priceChild: 1500000,
    priceInfant: 0,
    availableDates: [new Date('2026-05-10'), new Date('2026-05-15'), new Date('2026-05-20'), new Date('2026-05-25')],
    pickupPoints: ['TP.HCM', 'Nha Trang', 'Tự túc'],
  },
  {
    name: "Phú Quốc",
    description: "Đảo ngọc với bãi biển đẹp",
    category: "beach",
    address: "Kiên Giang",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 10.289,
    lng: 103.992,
    rating: 4.8,
    isActive: true,
    priceAdult: 3200000,
    priceChild: 1800000,
    priceInfant: 400000,
    availableDates: [new Date('2026-05-08'), new Date('2026-05-14'), new Date('2026-05-22')],
    pickupPoints: ['TP.HCM', 'Phú Quốc', 'Tự túc'],
  },
  {
    name: "Sa Pa",
    description: "Thị trấn trong mây, ruộng bậc thang",
    category: "mountain",
    address: "Lào Cai",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 22.335,
    lng: 103.867,
    rating: 4.9,
    isActive: true,
    priceAdult: 2800000,
    priceChild: 1600000,
    priceInfant: 0,
    availableDates: [new Date('2026-05-11'), new Date('2026-05-16'), new Date('2026-05-21')],
    pickupPoints: ['Hà Nội', 'Lào Cai', 'Tự túc'],
  },
  {
    name: "Đà Lạt",
    description: "Thành phố ngàn hoa, khí hậu mát mẻ",
    category: "mountain",
    address: "Lâm Đồng",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 11.946,
    lng: 108.441,
    rating: 4.8,
    isActive: true,
    priceAdult: 2200000,
    priceChild: 1300000,
    priceInfant: 0,
    availableDates: [new Date('2026-05-09'), new Date('2026-05-14'), new Date('2026-05-19')],
    pickupPoints: ['TP.HCM', 'Đà Lạt', 'Tự túc'],
  },
  {
    name: "Phố cổ Hội An",
    description: "Di sản văn hóa thế giới",
    category: "culture",
    address: "Quảng Nam",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 15.877,
    lng: 108.326,
    rating: 4.9,
    isActive: true,
    // Hội An có thể không có tour trọn gói, nhưng vẫn thêm dữ liệu mẫu
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 0,
    availableDates: [],
    pickupPoints: [],
  },
  {
    name: "Chợ Bến Thành",
    description: "Khu chợ nổi tiếng Sài Gòn",
    category: "food",
    address: "TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 10.772,
    lng: 106.698,
    rating: 4.4,
    isActive: true,
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 0,
    availableDates: [],
    pickupPoints: [],
  },
  {
    name: "Chùa Thiên Mụ",
    description: "Ngôi chùa cổ kính bên sông Hương",
    category: "spiritual",
    address: "Huế",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 16.45,
    lng: 107.55,
    rating: 4.7,
    isActive: true,
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 0,
    availableDates: [],
    pickupPoints: [],
  },
  {
    name: "Hà Nội",
    description: "Thủ đô ngàn năm văn hiến",
    category: "city",
    address: "Hà Nội",
    image: "https://images.unsplash.com/photo-1589552322440-9a62b34e3a2c?w=600",
    lat: 21.0285,
    lng: 105.8542,
    rating: 4.7,
    isActive: true,
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 0,
    availableDates: [],
    pickupPoints: [],
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');
    
    // Xóa dữ liệu cũ
    await Place.deleteMany({});
    console.log('🗑️ Đã xóa dữ liệu cũ');
    
    // Thêm dữ liệu mới
    await Place.insertMany(places);
    console.log(`✅ Đã thêm ${places.length} địa điểm mẫu`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  }
}

seed();