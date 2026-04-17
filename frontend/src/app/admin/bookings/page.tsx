'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, CheckCircle, XCircle, Clock, Eye, Trash2 } from 'lucide-react';

interface Booking {
  _id: string;
  user: { name: string; email: string };
  place: { name: string };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearch,
        status: statusFilter,
      });
      const res = await fetch(`${API_URL}/admin/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, API_URL]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchBookings();
      } else {
        alert('Cập nhật thất bại');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa booking này?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/admin/bookings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Chờ xác nhận', style: { backgroundColor: '#fef3c7', color: '#d97706' } };
      case 'confirmed':
        return { text: 'Đã xác nhận', style: { backgroundColor: '#dcfce7', color: '#16a34a' } };
      case 'cancelled':
        return { text: 'Đã hủy', style: { backgroundColor: '#fee2e2', color: '#dc2626' } };
      case 'completed':
        return { text: 'Hoàn thành', style: { backgroundColor: '#e0e7ff', color: '#4f46e5' } };
      default:
        return { text: status, style: { backgroundColor: '#f3f4f6', color: '#374151' } };
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = { padding: '24px' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
  const titleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' };
  const toolbarStyle: React.CSSProperties = { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' };
  const searchBoxStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', flex: 1, minWidth: '200px' };
  const filterSelectStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' };
  const refreshButtonStyle: React.CSSProperties = { padding: '8px 16px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 };
  const tdStyle: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' };
  const statusSelectStyle: React.CSSProperties = { padding: '4px 8px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer' };
  const actionButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '8px', borderRadius: '4px' };
  const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' };
  const pageButtonStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý đặt chỗ</h1>
        <button onClick={() => fetchBookings()} style={refreshButtonStyle}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      <div style={toolbarStyle}>
        <div style={searchBoxStyle}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng hoặc địa điểm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', marginLeft: '8px', flex: 1 }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={filterSelectStyle}>
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="cancelled">Đã hủy</option>
          <option value="completed">Hoàn thành</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Không có đặt chỗ nào</div>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Khách hàng</th>
                <th style={thStyle}>Địa điểm</th>
                <th style={thStyle}>Ngày nhận</th>
                <th style={thStyle}>Ngày trả</th>
                <th style={thStyle}>Số khách</th>
                <th style={thStyle}>Tổng tiền</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Ngày đặt</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const statusInfo = getStatusBadge(booking.status);
                return (
                  <tr key={booking._id}>
                    <td style={tdStyle}>{booking.user?.name || 'N/A'}</td>
                    <td style={tdStyle}>{booking.place?.name || 'N/A'}</td>
                    <td style={tdStyle}>{new Date(booking.checkIn).toLocaleDateString('vi-VN')}</td>
                    <td style={tdStyle}>{new Date(booking.checkOut).toLocaleDateString('vi-VN')}</td>
                    <td style={tdStyle}>{booking.guests}</td>
                    <td style={tdStyle}>{booking.totalPrice?.toLocaleString()} VND</td>
                    <td style={tdStyle}>
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                        style={statusSelectStyle}
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="completed">Hoàn thành</option>
                      </select>
                    </td>
                    <td style={tdStyle}>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleDelete(booking._id)} style={actionButtonStyle} title="Xóa">
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div style={paginationStyle}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} style={{ ...pageButtonStyle, opacity: page === 1 ? 0.5 : 1 }}>Trước</button>
              <span>Trang {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} style={{ ...pageButtonStyle, opacity: page === totalPages ? 0.5 : 1 }}>Sau</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}