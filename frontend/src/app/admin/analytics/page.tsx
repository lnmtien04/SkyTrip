'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, MapPin, ShoppingBag } from 'lucide-react';

interface Booking {
  _id: string;
  status: string;
  totalPrice?: number;
  createdAt: string;
  adults: number;
  children: number;
  infants: number;
  place?: {
    name: string;
    priceAdult?: number;
    priceChild?: number;
    priceInfant?: number;
    basePrice?: number;
  };
}

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalPlaces: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [viewsData, setViewsData] = useState([]);
  const [topPlaces, setTopPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const DEFAULT_PRICE = 500000;

  // Hàm tính tổng tiền giống như trang bookings (dùng totalPrice nếu có)
  const computeTotalPrice = (booking: Booking): number => {
    if (booking.totalPrice && booking.totalPrice > 0) return booking.totalPrice;
    const adultPrice = booking.place?.priceAdult ?? booking.place?.basePrice ?? DEFAULT_PRICE;
    const childPrice = booking.place?.priceChild ?? (booking.place?.basePrice ? booking.place.basePrice * 0.5 : DEFAULT_PRICE * 0.5);
    const infantPrice = booking.place?.priceInfant ?? 0;
    return (booking.adults * adultPrice) + (booking.children * childPrice) + (booking.infants * infantPrice);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Lấy dữ liệu từ các API
      const [statsRes, viewsRes, topPlacesRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/admin/analytics/overview`, { headers }),
        fetch(`${API_URL}/admin/analytics/views`, { headers }),
        fetch(`${API_URL}/admin/analytics/top-places`, { headers }),
        fetch(`${API_URL}/admin/bookings?limit=10000`, { headers })
      ]);

      const statsData = await statsRes.json();
      const viewsDataRaw = await viewsRes.json();
      const topPlacesData = await topPlacesRes.json();
      const bookingsData = await bookingsRes.json();

      const allBookings: Booking[] = bookingsData.bookings || [];
      const completedBookings = allBookings.filter(b => b.status === 'completed');
      
      // Tính tổng doanh thu từ completed bookings
      let totalRevenue = 0;
      completedBookings.forEach(booking => {
        totalRevenue += computeTotalPrice(booking);
      });

      // Tính doanh thu theo tháng
      const monthlyRevenue: { [key: string]: number } = {};
      completedBookings.forEach(booking => {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const amount = computeTotalPrice(booking);
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + amount;
      });
      const revenueArray = Object.keys(monthlyRevenue).sort().map(month => ({
        month: month,
        revenue: monthlyRevenue[month]
      }));

      setOverview({
        totalUsers: statsData.totalUsers || 0,
        totalPlaces: statsData.totalPlaces || 0,
        totalBookings: statsData.totalBookings || allBookings.length,
        completedBookings: completedBookings.length,
        totalRevenue: totalRevenue
      });
      setRevenueData(revenueArray);
      setViewsData(viewsDataRaw);
      setTopPlaces(topPlacesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Tổng người dùng', value: overview.totalUsers, icon: Users, color: '#3b82f6' },
    { title: 'Tổng địa điểm', value: overview.totalPlaces, icon: MapPin, color: '#10b981' },
    { title: 'Tổng đặt chỗ', value: overview.totalBookings, icon: ShoppingBag, color: '#f97316' },
    { title: 'Doanh thu (đã thanh toán)', value: overview.totalRevenue.toLocaleString() + ' VND', icon: DollarSign, color: '#8b5cf6' }
  ];

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Thống kê nâng cao</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{card.title}</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px' }}>{card.value}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: `${card.color}10` }}>
                <card.icon size={24} color={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Doanh thu theo tháng</h2>
        <div style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} VND`} />
              <Bar dataKey="revenue" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Lượt xem 7 ngày qua</h2>
        <div style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Top địa điểm được đặt nhiều nhất</h2>
        {topPlaces.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Chưa có dữ liệu</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topPlaces} dataKey="bookings" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {topPlaces.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topPlaces.map((place, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 500 }}>{place.name}</span>
                    <span style={{ color: '#f97316' }}>{place.bookings} đặt</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}