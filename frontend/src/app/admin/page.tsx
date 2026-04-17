'use client';

import { useState, useEffect } from 'react';
import { Users, MapPin, FileText, Eye, TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, locations: 0, posts: 0, views: 0 });
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Gọi API dashboard tổng hợp (đã có dữ liệu thật)
        const res = await fetch(`${API_URL}/admin/dashboard`, { headers });
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const data = await res.json();

        setStats(data.stats);
        setChartData(data.chartData);
        setActivities(data.recentActivities);
      } catch (error) {
        console.error('Lỗi tải dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: '24px' }}>Đang tải dữ liệu...</div>;

  const statCards = [
    { title: 'Tổng người dùng', value: stats.users, icon: Users, change: '+12%', up: true },
    { title: 'Địa điểm', value: stats.locations, icon: MapPin, change: '+8%', up: true },
    { title: 'Bài viết', value: stats.posts, icon: FileText, change: '+5%', up: true },
    { title: 'Lượt xem', value: stats.views.toLocaleString(), icon: Eye, change: '+23%', up: true },
  ];

  const totalVisits = chartData.reduce((sum, item) => sum + item.visits, 0);
  const percentChange = ((totalVisits - 3800) / 3800 * 100).toFixed(0);

  // Styles (giữ nguyên inline style đẹp)
  const containerStyle = { padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' };
  const titleStyle = { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' };
  const subtitleStyle = { fontSize: '14px', color: '#6b7280', marginBottom: '24px' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' };
  const cardStyle = { backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' };
  const cardTitleStyle = { fontSize: '14px', color: '#6b7280', marginBottom: '8px' };
  const cardValueStyle = { fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' };
  const cardChangeStyle = { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '8px' };
  const chartContainerStyle = { backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e5e7eb', marginBottom: '32px' };
  const chartHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' };
  const chartTitleStyle = { fontSize: '18px', fontWeight: '600', color: '#1f2937' };
  const chartSubStyle = { fontSize: '13px', color: '#6b7280', marginTop: '4px' };
  const chartBoxStyle = { height: '320px', width: '100%' };
  const activityContainerStyle = { backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e5e7eb' };
  const activityTitleStyle = { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' };
  const activityItemStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f3f4f6' };
  const avatarStyle = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' };
  const activityTextStyle = { flex: 1 };
  const activityNameStyle = { fontSize: '14px', fontWeight: '500', color: '#1f2937' };
  const activityActionStyle = { fontSize: '12px', color: '#6b7280' };
  const activityTimeStyle = { fontSize: '12px', color: '#9ca3af' };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Dashboard</h1>
      <p style={subtitleStyle}>Tổng quan hệ thống</p>

      <div style={gridStyle}>
        {statCards.map((card, idx) => (
          <div key={idx} style={cardStyle}>
            <div style={cardTitleStyle}>{card.title}</div>
            <div style={cardValueStyle}>{card.value}</div>
            <div style={cardChangeStyle}>
              {card.up ? <TrendingUp size={14} color="#16a34a" /> : <TrendingDown size={14} color="#dc2626" />}
              <span style={{ color: card.up ? '#16a34a' : '#dc2626', fontWeight: 500 }}>{card.change}</span>
              <span style={{ color: '#9ca3af' }}>so với tuần trước</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <div style={chartContainerStyle}>
            <div style={chartHeaderStyle}>
              <div>
                <div style={chartTitleStyle}>Lượt truy cập (7 ngày gần nhất)</div>
                <div style={chartSubStyle}>So với tuần trước <span style={{ color: '#16a34a', fontWeight: 500 }}>+{percentChange}%</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                <Calendar size={14} /> <span>Tuần này</span>
              </div>
            </div>
            <div style={chartBoxStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={activityContainerStyle}>
            <div style={activityTitleStyle}>Hoạt động gần đây</div>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>Chưa có hoạt động</div>
            ) : (
              activities.map((act) => (
                <div key={act.id} style={activityItemStyle}>
                  <div style={avatarStyle}><Activity size={16} /></div>
                  <div style={activityTextStyle}>
                    <div style={activityNameStyle}>{act.user}</div>
                    <div style={activityActionStyle}>{act.action}</div>
                  </div>
                  <div style={activityTimeStyle}>{act.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}