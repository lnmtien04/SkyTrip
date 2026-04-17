'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: search,
      });
      // Gọi đúng endpoint (backend mount tại /api/categories)
      const res = await fetch(`${API_URL}/categories?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      console.log('API response:', data);
      
      // Xử lý linh hoạt cấu trúc response
      let categoriesData = [];
      let pages = 1;
      if (Array.isArray(data)) {
        categoriesData = data;
        pages = Math.ceil(data.length / 10) || 1;
      } else if (data.categories) {
        categoriesData = data.categories;
        pages = data.pages || 1;
      } else if (data.data && Array.isArray(data.data)) {
        categoriesData = data.data;
        pages = data.pages || 1;
      }
      setCategories(categoriesData);
      setTotalPages(pages);
      console.log('Set categories:', categoriesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, search, API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const url = editingCategory ? `${API_URL}/categories/${editingCategory._id}` : `${API_URL}/categories`;
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '' });
        fetchCategories();
      } else {
        const err = await res.json();
        setError(err.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error(error);
      setError('Có lỗi xảy ra');
    }
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    setShowModal(true);
  };

  // Styles (giữ nguyên)
  const containerStyle: React.CSSProperties = { padding: '24px' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
  const titleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' };
  const addButtonStyle: React.CSSProperties = { backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
  const toolbarStyle: React.CSSProperties = { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' };
  const searchBoxStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', flex: 1, minWidth: '200px' };
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600 };
  const tdStyle: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' };
  const actionButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '8px', borderRadius: '4px' };
  const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' };
  const pageButtonStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' };
  const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const modalStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' };
  const errorStyle: React.CSSProperties = { backgroundColor: '#fef2f2', color: '#dc2626', padding: '8px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' };
  const modalButtonStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý danh mục</h1>
        <button onClick={openCreateModal} style={addButtonStyle}>
          <Plus size={16} /> Thêm danh mục
        </button>
      </div>

      <div style={toolbarStyle}>
        <div style={searchBoxStyle}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', marginLeft: '8px', flex: 1 }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Tên danh mục</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Mô tả</th>
                <th style={thStyle}>Ngày tạo</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Chưa có danh mục nào</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id}>
                    <td style={tdStyle}>{cat.name}</td>
                    <td style={tdStyle}>{cat.slug}</td>
                    <td style={tdStyle}>{cat.description || '—'}</td>
                    <td style={tdStyle}>{new Date(cat.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={tdStyle}>
                      <button onClick={() => openEditModal(cat)} style={actionButtonStyle} title="Sửa"><Edit2 size={16} color="#3b82f6" /></button>
                      <button onClick={() => handleDelete(cat._id, cat.name)} style={actionButtonStyle} title="Xóa"><Trash2 size={16} color="#ef4444" /></button>
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
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {error && <div style={errorStyle}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Tên danh mục *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
                required
              />
              <input
                type="text"
                placeholder="Slug (ví dụ: du-lich-bien)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                style={inputStyle}
                required
              />
              <textarea
                placeholder="Mô tả (không bắt buộc)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ ...inputStyle, minHeight: '80px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...modalButtonStyle, backgroundColor: '#e5e7eb' }}>Hủy</button>
                <button type="submit" style={{ ...modalButtonStyle, backgroundColor: '#f97316', color: 'white' }}>{editingCategory ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}