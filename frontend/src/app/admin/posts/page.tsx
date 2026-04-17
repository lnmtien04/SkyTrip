'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image: string;
  author: { name: string };
  status: 'published' | 'draft';
  views: number;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    image: '',
    status: 'draft',
  });
  const [uploading, setUploading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearch,
        status: statusFilter,
      });
      const res = await fetch(`${API_URL}/admin/posts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
     const data = await res.json();
console.log('API response:', data); // kiểm tra console
setPosts(data.posts || (Array.isArray(data) ? data : []));
setTotalPages(data.pages || 1);
    } catch (error) {
      console.error(error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/admin/posts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/admin/posts/${id}/toggle-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formDataFile = new FormData();
    formDataFile.append('images', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataFile,
      });
      const data = await res.json();
      if (data[0]) {
        setFormData(prev => ({ ...prev, image: data[0] }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingPost ? `${API_URL}/admin/posts/${editingPost._id}` : `${API_URL}/admin/posts`;
      const method = editingPost ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setEditingPost(null);
        setFormData({ title: '', content: '', excerpt: '', category: '', image: '', status: 'draft' });
        fetchPosts();
      } else {
        const err = await res.json();
        alert(err.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      image: post.image || '',
      status: post.status,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', excerpt: '', category: '', image: '', status: 'draft' });
    setShowModal(true);
  };

  const categories = ['Du lịch', 'Ẩm thực', 'Khám phá', 'Kinh nghiệm', 'Tin tức'];

  // Styles (giữ nguyên như trang locations)
  const containerStyle: React.CSSProperties = { padding: '24px' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
  const titleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' };
  const addButtonStyle: React.CSSProperties = { backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
  const toolbarStyle: React.CSSProperties = { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' };
  const searchBoxStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', flex: 1, minWidth: '200px' };
  const filterSelectStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' };
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 };
  const tdStyle: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' };
  const thumbnailStyle: React.CSSProperties = { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' };
  const badgePublishedStyle: React.CSSProperties = { backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 };
  const badgeDraftStyle: React.CSSProperties = { backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 };
  const actionButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '8px', borderRadius: '4px' };
  const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' };
  const pageButtonStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' };
  const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const modalStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' };
  const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: '100px' };
  const modalButtonStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý bài viết</h1>
        <button onClick={openCreateModal} style={addButtonStyle}>
          <Plus size={16} /> Thêm bài viết
        </button>
      </div>

      <div style={toolbarStyle}>
        <div style={searchBoxStyle}>
          <Search size={16} color="#9ca3af" />
          <input type="text" placeholder="Tìm theo tiêu đề..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', marginLeft: '8px', flex: 1 }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={filterSelectStyle}>
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Bản nháp</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Ảnh</th>
                <th style={thStyle}>Tiêu đề</th>
                <th style={thStyle}>Danh mục</th>
                <th style={thStyle}>Tác giả</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Lượt xem</th>
                <th style={thStyle}>Ngày tạo</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>Chưa có bài viết nào</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id}>
                    <td style={tdStyle}>
                      {post.image ? <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} style={thumbnailStyle} /> : <div style={{ width: 50, height: 50, background: '#f3f4f6', borderRadius: 8 }}></div>}
                    </td>
                    <td style={tdStyle}>{post.title}</td>
                    <td style={tdStyle}>{post.category}</td>
                    <td style={tdStyle}>{post.author?.name || 'Admin'}</td>
                    <td style={tdStyle}>
                      <span style={post.status === 'published' ? badgePublishedStyle : badgeDraftStyle}>
                        {post.status === 'published' ? 'Xuất bản' : 'Nháp'}
                      </span>
                    </td>
                    <td style={tdStyle}>{post.views || 0}</td>
                    <td style={tdStyle}>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleToggleStatus(post._id)} style={actionButtonStyle} title={post.status === 'published' ? 'Chuyển về nháp' : 'Xuất bản'}>
                        {post.status === 'published' ? <EyeOff size={16} color="#f59e0b" /> : <Eye size={16} color="#10b981" />}
                      </button>
                      <button onClick={() => openEditModal(post)} style={actionButtonStyle} title="Sửa"><Edit2 size={16} color="#3b82f6" /></button>
                      <button onClick={() => handleDelete(post._id, post.title)} style={actionButtonStyle} title="Xóa"><Trash2 size={16} color="#ef4444" /></button>
                    </td>
                  </tr>
                ))
              )}
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

      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Tiêu đề *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={inputStyle} required />
              <textarea placeholder="Nội dung *" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} style={textareaStyle} required />
              <textarea placeholder="Mô tả ngắn (excerpt)" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} style={inputStyle} />
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={inputStyle} required>
                <option value="">Chọn danh mục</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ flex: 1 }} />
                {uploading && <span>Đang tải...</span>}
                {formData.image && <img src={`http://localhost:5000/uploads/${formData.image}`} alt="preview" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />}
              </div>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                <option value="draft">Bản nháp</option>
                <option value="published">Xuất bản</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...modalButtonStyle, backgroundColor: '#e5e7eb' }}>Hủy</button>
                <button type="submit" style={{ ...modalButtonStyle, backgroundColor: '#f97316', color: 'white' }}>{editingPost ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}