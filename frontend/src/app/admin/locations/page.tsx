'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface Place {
  _id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  priceAdult?: number;
  priceChild?: number;
  priceInfant?: number;
  availableDates?: string[];
  pickupPoints?: string[];
  duration?: number; // số ngày của tour
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminLocationsPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    image: '',
    isActive: true,
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 0,
    duration: 1,
    availableDatesStr: '',
    pickupPointsStr: '',
  });
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
        else if (data.categories) setCategories(data.categories);
        else if (data.data && Array.isArray(data.data)) setCategories(data.data);
        else setCategories([]);
      } else {
        console.error('Failed to fetch categories:', res.status);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearch,
        status: statusFilter,
      });
      const res = await fetch(`${API_URL}/admin/places?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlaces(data.places);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, API_URL]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa địa điểm "${name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/admin/places/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchPlaces();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/admin/places/${id}/toggle-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPlaces();
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
        const imageUrl = data[0];
        setFormData(prev => ({ ...prev, image: imageUrl }));
        setPreviewImage(`${API_URL.replace('/api', '')}/uploads/${imageUrl}`);
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
      const url = editingPlace ? `${API_URL}/admin/places/${editingPlace._id}` : `${API_URL}/admin/places`;
      const method = editingPlace ? 'PUT' : 'POST';
      const submitData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        address: formData.address,
        image: formData.image,
        isActive: formData.isActive,
        priceAdult: formData.priceAdult,
        priceChild: formData.priceChild,
        priceInfant: formData.priceInfant,
        duration: formData.duration,
        availableDates: formData.availableDatesStr ? formData.availableDatesStr.split(',').map(d => new Date(d.trim())) : [],
        pickupPoints: formData.pickupPointsStr ? formData.pickupPointsStr.split(',').map(p => p.trim()) : [],
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(submitData),
      });
      if (res.ok) {
        setShowModal(false);
        setEditingPlace(null);
        setFormData({
          name: '', description: '', category: '', address: '', image: '', isActive: true,
          priceAdult: 0, priceChild: 0, priceInfant: 0, duration: 1, availableDatesStr: '', pickupPointsStr: '',
        });
        setPreviewImage('');
        fetchPlaces();
      } else {
        const err = await res.json();
        alert(err.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (place: Place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      description: place.description,
      category: place.category,
      address: place.address,
      image: place.image || '',
      isActive: place.isActive,
      priceAdult: place.priceAdult || 0,
      priceChild: place.priceChild || 0,
      priceInfant: place.priceInfant || 0,
      duration: place.duration || 1,
      availableDatesStr: (place.availableDates || []).map(d => new Date(d).toISOString().split('T')[0]).join(', '),
      pickupPointsStr: (place.pickupPoints || []).join(', '),
    });
    if (place.image) {
      setPreviewImage(`${API_URL.replace('/api', '')}/uploads/${place.image}`);
    } else {
      setPreviewImage('');
    }
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingPlace(null);
    setFormData({
      name: '', description: '', category: '', address: '', image: '', isActive: true,
      priceAdult: 0, priceChild: 0, priceInfant: 0, duration: 1, availableDatesStr: '', pickupPointsStr: '',
    });
    setPreviewImage('');
    setShowModal(true);
  };

  // Styles
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
  const badgeActiveStyle: React.CSSProperties = { backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 };
  const badgeInactiveStyle: React.CSSProperties = { backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 };
  const actionButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '8px', borderRadius: '4px' };
  const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' };
  const pageButtonStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' };
  const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const modalStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px', boxSizing: 'border-box' };
  const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: '80px' };
  const modalButtonStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý địa điểm</h1>
        <button onClick={openCreateModal} style={addButtonStyle}>
          <Plus size={16} /> Thêm địa điểm
        </button>
      </div>

      <div style={toolbarStyle}>
        <div style={searchBoxStyle}>
          <Search size={16} color="#9ca3af" />
          <input type="text" placeholder="Tìm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', marginLeft: '8px', flex: 1 }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={filterSelectStyle}>
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hiển thị</option>
          <option value="inactive">Đã ẩn</option>
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
                <th style={thStyle}>Tên địa điểm</th>
                <th style={thStyle}>Danh mục</th>
                <th style={thStyle}>Địa chỉ</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Ngày tạo</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place._id}>
                  <td style={tdStyle}>
                    {place.image ? <img src={`${API_URL.replace('/api', '')}/uploads/${place.image}`} alt={place.name} style={thumbnailStyle} /> : <div style={{ width: 50, height: 50, background: '#f3f4f6', borderRadius: 8 }}></div>}
                  </td>
                  <td style={tdStyle}>{place.name}</td>
                  <td style={tdStyle}>{place.category}</td>
                  <td style={tdStyle}>{place.address}</td>
                  <td style={tdStyle}>
                    <span style={place.isActive ? badgeActiveStyle : badgeInactiveStyle}>
                      {place.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(place.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleToggleStatus(place._id)} style={actionButtonStyle} title={place.isActive ? 'Ẩn' : 'Hiển thị'}>
                      {place.isActive ? <EyeOff size={16} color="#f59e0b" /> : <Eye size={16} color="#10b981" />}
                    </button>
                    <button onClick={() => openEditModal(place)} style={actionButtonStyle} title="Sửa"><Edit2 size={16} color="#3b82f6" /></button>
                    <button onClick={() => handleDelete(place._id, place.name)} style={actionButtonStyle} title="Xóa"><Trash2 size={16} color="#ef4444" /></button>
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

      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{editingPlace ? 'Sửa địa điểm' : 'Thêm địa điểm'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Tên địa điểm *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required />
              <textarea placeholder="Mô tả *" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={textareaStyle} required />
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={inputStyle} required>
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <input type="text" placeholder="Địa chỉ *" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} style={inputStyle} required />

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Hình ảnh</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '8px' }} />
                {uploading && <div>Đang tải ảnh...</div>}
                {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />}
              </div>

              {/* Thông tin tour */}
              <div style={{ marginTop: '20px', marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>🏖️ Thông tin tour (nếu là tour du lịch)</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Giá người lớn (VNĐ)</label>
                    <input type="number" placeholder="VD: 2500000" value={formData.priceAdult} onChange={(e) => setFormData({ ...formData, priceAdult: parseInt(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Giá trẻ em (6-11 tuổi)</label>
                    <input type="number" placeholder="VD: 1500000" value={formData.priceChild} onChange={(e) => setFormData({ ...formData, priceChild: parseInt(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Giá em bé (&lt;6 tuổi)</label>
                    <input type="number" placeholder="VD: 0" value={formData.priceInfant} onChange={(e) => setFormData({ ...formData, priceInfant: parseInt(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Số ngày tour</label>
                    <input type="number" placeholder="VD: 3" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })} style={inputStyle} min={1} />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Ngày khởi hành (cách nhau dấu phẩy)</label>
                  <input type="text" placeholder="VD: 2026-05-10, 2026-05-15, 2026-05-20" value={formData.availableDatesStr} onChange={(e) => setFormData({ ...formData, availableDatesStr: e.target.value })} style={inputStyle} />
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Nhập các ngày theo định dạng YYYY-MM-DD, cách nhau bằng dấu phẩy</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Điểm đón (cách nhau dấu phẩy)</label>
                  <input type="text" placeholder="VD: TP.HCM, Hà Nội, Đà Nẵng, Tự túc" value={formData.pickupPointsStr} onChange={(e) => setFormData({ ...formData, pickupPointsStr: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                Hiển thị công khai
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...modalButtonStyle, backgroundColor: '#e5e7eb' }}>Hủy</button>
                <button type="submit" style={{ ...modalButtonStyle, backgroundColor: '#f97316', color: 'white' }}>{editingPlace ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}