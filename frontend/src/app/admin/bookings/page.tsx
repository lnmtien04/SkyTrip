'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Trash2, Eye, Edit, Printer } from 'lucide-react';

interface Booking {
  _id: string;
  user: { name: string; email: string };
  place: { name: string; basePrice?: number };
  departureDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  totalPrice?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerIdNumber?: string;
  pickupPoint?: string;
  specialRequests?: string;
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
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    departureDate: '',
    endDate: '',
    status: 'pending' as Booking['status'],
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const DEFAULT_PRICE = 500000;

  // Fetch bookings
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

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Tính tổng tiền
  const computeTotalPrice = (booking: Booking): number => {
    if (booking.totalPrice && booking.totalPrice > 0) return booking.totalPrice;
    const basePrice = booking.place?.basePrice || DEFAULT_PRICE;
    const adultTotal = (booking.adults || 0) * basePrice;
    const childTotal = (booking.children || 0) * basePrice * 0.5;
    return adultTotal + childTotal;
  };

  // Cập nhật trạng thái nhanh
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchBookings();
      else alert('Cập nhật thất bại');
    } catch (err) {
      console.error(err);
    }
  };

  // Xóa booking
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

  // Mở modal chi tiết
  const openDetailModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  // Mở modal sửa
  const openEditModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({
      adults: booking.adults,
      children: booking.children,
      infants: booking.infants,
      departureDate: booking.departureDate?.split('T')[0] || '',
      endDate: booking.endDate?.split('T')[0] || '',
      status: booking.status,
    });
    setIsEditModalOpen(true);
  };

  // Lưu chỉnh sửa
  const handleEditSubmit = async () => {
    if (!selectedBooking) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/bookings/${selectedBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        fetchBookings();
        setIsEditModalOpen(false);
        alert('Cập nhật thành công');
      } else {
        alert('Cập nhật thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối');
    }
  };

  // In hóa đơn
  const printInvoice = (booking: Booking) => {
    const total = computeTotalPrice(booking);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Vui lòng cho phép cửa sổ bật lên để in hóa đơn');
      return;
    }
    printWindow.document.write(`
      <html>
        <head><title>Hóa đơn thanh toán tour</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="text-align: center;">HÓA ĐƠN THANH TOÁN TOUR</h2>
          <hr />
          <p><strong>Khách hàng:</strong> ${booking.customerName || booking.user?.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${booking.customerEmail || booking.user?.email || 'N/A'}</p>
          <p><strong>SĐT:</strong> ${booking.customerPhone || 'N/A'}</p>
          <p><strong>Địa điểm:</strong> ${booking.place?.name || 'N/A'}</p>
          <p><strong>Ngày khởi hành:</strong> ${new Date(booking.departureDate).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ngày kết thúc:</strong> ${new Date(booking.endDate).toLocaleDateString('vi-VN')}</p>
          <p><strong>Số lượng:</strong> Người lớn: ${booking.adults}, Trẻ em: ${booking.children}, Em bé: ${booking.infants}</p>
          <p><strong>Điểm đón:</strong> ${booking.pickupPoint || 'Không có'}</p>
          <p><strong>Yêu cầu đặc biệt:</strong> ${booking.specialRequests || 'Không'}</p>
          <hr />
          <h3 style="text-align: right;">Tổng tiền: ${total.toLocaleString('vi-VN')} VND</h3>
          <p style="text-align: center; margin-top: 40px;">Cảm ơn quý khách!</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Helper format
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '--' : date.toLocaleDateString('vi-VN');
  };
  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' VND';

  // Styles (giữ nguyên, có thể thêm cho modal)
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  };
  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white', borderRadius: '16px', padding: '24px', maxWidth: '600px', width: '90%',
    maxHeight: '80vh', overflowY: 'auto',
  };
  const inputStyle: React.CSSProperties = { padding: '8px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' };
  const buttonStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginRight: '8px' };

  // Các style khác giữ nguyên từ code cũ (đã có)
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
          <input type="text" placeholder="Tìm theo tên khách hàng hoặc địa điểm..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', marginLeft: '8px', flex: 1 }} />
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
                <th style={thStyle}>Ngày khởi hành</th>
                <th style={thStyle}>Ngày kết thúc</th>
                <th style={thStyle}>Người lớn</th>
                <th style={thStyle}>Trẻ em</th>
                <th style={thStyle}>Em bé</th>
                <th style={thStyle}>Tổng tiền</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Ngày đặt</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const total = computeTotalPrice(booking);
                return (
                  <tr key={booking._id}>
                    <td style={tdStyle}>{booking.customerName || booking.user?.name || 'N/A'}</td>
                    <td style={tdStyle}>{booking.place?.name || 'N/A'}</td>
                    <td style={tdStyle}>{formatDate(booking.departureDate)}</td>
                    <td style={tdStyle}>{formatDate(booking.endDate)}</td>
                    <td style={tdStyle}>{booking.adults || 0}</td>
                    <td style={tdStyle}>{booking.children || 0}</td>
                    <td style={tdStyle}>{booking.infants || 0}</td>
                    <td style={tdStyle}>{formatPrice(total)}</td>
                    <td style={tdStyle}>
                      <select value={booking.status} onChange={(e) => handleUpdateStatus(booking._id, e.target.value)} style={statusSelectStyle}>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="completed">Hoàn thành</option>
                      </select>
                    </td>
                    <td style={tdStyle}>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={tdStyle}>
                      <button onClick={() => openDetailModal(booking)} style={actionButtonStyle} title="Xem chi tiết"><Eye size={16} color="#3b82f6" /></button>
                      <button onClick={() => openEditModal(booking)} style={actionButtonStyle} title="Sửa"><Edit size={16} color="#f59e0b" /></button>
                      <button onClick={() => handleDelete(booking._id)} style={actionButtonStyle} title="Xóa"><Trash2 size={16} color="#ef4444" /></button>
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

      {/* Modal chi tiết */}
      {isDetailModalOpen && selectedBooking && (
        <div style={modalOverlayStyle} onClick={() => setIsDetailModalOpen(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết đặt chỗ</h2>
            <p><strong>Khách hàng:</strong> {selectedBooking.customerName || selectedBooking.user?.name}</p>
            <p><strong>Email:</strong> {selectedBooking.customerEmail || selectedBooking.user?.email}</p>
            <p><strong>SĐT:</strong> {selectedBooking.customerPhone || 'N/A'}</p>
            <p><strong>CMND/CCCD:</strong> {selectedBooking.customerIdNumber || 'N/A'}</p>
            <p><strong>Địa điểm:</strong> {selectedBooking.place?.name}</p>
            <p><strong>Ngày khởi hành:</strong> {formatDate(selectedBooking.departureDate)}</p>
            <p><strong>Ngày kết thúc:</strong> {formatDate(selectedBooking.endDate)}</p>
            <p><strong>Số lượng:</strong> Người lớn: {selectedBooking.adults}, Trẻ em: {selectedBooking.children}, Em bé: {selectedBooking.infants}</p>
            <p><strong>Điểm đón:</strong> {selectedBooking.pickupPoint || 'Không có'}</p>
            <p><strong>Yêu cầu đặc biệt:</strong> {selectedBooking.specialRequests || 'Không'}</p>
            <p><strong>Tổng tiền:</strong> {formatPrice(computeTotalPrice(selectedBooking))}</p>
            <p><strong>Trạng thái:</strong> {selectedBooking.status}</p>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => printInvoice(selectedBooking)} style={{ ...buttonStyle, backgroundColor: '#10b981', color: 'white' }}><Printer size={16} style={{ display: 'inline', marginRight: '4px' }} /> In hóa đơn</button>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ ...buttonStyle, backgroundColor: '#6b7280', color: 'white' }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa */}
      {isEditModalOpen && selectedBooking && (
        <div style={modalOverlayStyle} onClick={() => setIsEditModalOpen(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Chỉnh sửa đặt chỗ</h2>
            <div style={{ marginBottom: '12px' }}>
              <label>Người lớn:</label>
              <input type="number" min="0" value={editForm.adults} onChange={(e) => setEditForm({ ...editForm, adults: parseInt(e.target.value) || 0 })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Trẻ em:</label>
              <input type="number" min="0" value={editForm.children} onChange={(e) => setEditForm({ ...editForm, children: parseInt(e.target.value) || 0 })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Em bé:</label>
              <input type="number" min="0" value={editForm.infants} onChange={(e) => setEditForm({ ...editForm, infants: parseInt(e.target.value) || 0 })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Ngày khởi hành:</label>
              <input type="date" value={editForm.departureDate} onChange={(e) => setEditForm({ ...editForm, departureDate: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Ngày kết thúc:</label>
              <input type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Trạng thái:</label>
              <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })} style={inputStyle}>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleEditSubmit} style={{ ...buttonStyle, backgroundColor: '#f97316', color: 'white' }}>Lưu</button>
              <button onClick={() => setIsEditModalOpen(false)} style={{ ...buttonStyle, backgroundColor: '#6b7280', color: 'white' }}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}