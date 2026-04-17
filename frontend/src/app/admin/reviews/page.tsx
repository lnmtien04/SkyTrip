'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Star, User, MapPin } from 'lucide-react';

interface Review {
  _id: string;
  user: { name: string; email: string };
  place: { name: string; address: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearch,
      });
      const res = await fetch(`${API_URL}/admin/reviews?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setReviews(data.reviews || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, API_URL]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/admin/reviews/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const getStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={14} fill={i < rating ? '#f97316' : 'none'} color="#f97316" />
    ));
  };

  // Styles
  const containerStyle: React.CSSProperties = { padding: '24px' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
  const titleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' };
  const toolbarStyle: React.CSSProperties = { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' };
  const searchBoxStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', flex: 1, minWidth: '200px' };
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 };
  const tdStyle: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' };
  const actionButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '8px', borderRadius: '4px' };
  const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' };
  const pageButtonStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' };

  if (loading) return <div style={containerStyle}>Đang tải...</div>;
  if (error) return <div style={containerStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý đánh giá</h1>
      </div>

      <div style={toolbarStyle}>
        <div style={searchBoxStyle}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Tìm theo nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', marginLeft: '8px', flex: 1 }}
          />
        </div>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Chưa có đánh giá nào</div>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Người dùng</th>
                <th style={thStyle}>Địa điểm</th>
                <th style={thStyle}>Đánh giá</th>
                <th style={thStyle}>Nội dung</th>
                <th style={thStyle}>Ngày tạo</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="#6b7280" />
                      {review.user?.name || 'N/A'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="#6b7280" />
                      {review.place?.name || 'N/A'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {getStars(review.rating)}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {review.comment}
                    </div>
                  </td>
                  <td style={tdStyle}>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(review._id)} style={actionButtonStyle} title="Xóa">
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))}
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