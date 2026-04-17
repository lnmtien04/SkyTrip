// src/app/admin/users/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Lock, Unlock, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', isActive: true });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearch,
        role: roleFilter !== 'all' ? roleFilter : '',
        status: statusFilter !== 'all' ? statusFilter : '',
        sort: sortOrder,
      });
      const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter, statusFilter, sortOrder, API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Xóa thất bại');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Xóa người dùng thất bại');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${id}/toggle-active`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Thay đổi trạng thái thất bại');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Thao tác thất bại');
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error('Cập nhật vai trò thất bại');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Cập nhật vai trò thất bại');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingUser ? `${API_URL}/admin/users/${editingUser._id}` : `${API_URL}/admin/users`;
      const method = editingUser ? 'PUT' : 'POST';
      const payload = editingUser ? { role: formData.role, isActive: formData.isActive, name: formData.name, email: formData.email } : formData;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Lỗi khi lưu');
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user', isActive: true });
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role, isActive: user.isActive });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'user', isActive: true });
    setShowModal(true);
  };

  // Inline styles (giữ nguyên như trước)
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
  const avatarStyle: React.CSSProperties = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#4b5563' };
  const badgeAdminStyle: React.CSSProperties = { backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 };
  const badgeUserStyle: React.CSSProperties = { backgroundColor: '#f3f4f6', color: '#4b5563', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 };
  const badgeActiveStyle: React.CSSProperties = { backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 };
  const badgeInactiveStyle: React.CSSProperties = { backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 };
  const actionButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '8px', borderRadius: '4px' };
  const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' };
  const pageButtonStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' };
  const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const modalStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' };
  const modalButtonStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý tài khoản</h1>
        <button onClick={openCreateModal} style={addButtonStyle}>
          <Plus size={16} /> Thêm người dùng
        </button>
      </div>

      <div style={toolbarStyle}>
        <div style={searchBoxStyle}>
          <Search size={16} color="#9ca3af" />
          <input type="text" placeholder="Tìm theo tên hoặc email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', marginLeft: '8px', flex: 1 }} />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={filterSelectStyle}>
          <option value="all">Tất cả vai trò</option>
          <option value="admin">Quản trị viên</option>
          <option value="user">Người dùng</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={filterSelectStyle}>
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Bị khóa</option>
        </select>
        <button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')} style={filterSelectStyle}>
          Ngày tạo {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Người dùng</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Vai trò</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Ngày tạo</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={avatarStyle}>{user.name.charAt(0).toUpperCase()}</div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} style={{ ...filterSelectStyle, padding: '4px 8px' }}>
                      <option value="user">Người dùng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <span style={user.isActive ? badgeActiveStyle : badgeInactiveStyle}>
                      {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td style={tdStyle}>
                    <button onClick={() => openEditModal(user)} style={actionButtonStyle} title="Sửa"><Edit2 size={16} color="#3b82f6" /></button>
                    <button onClick={() => handleToggleActive(user._id, user.isActive)} style={actionButtonStyle} title={user.isActive ? 'Khóa' : 'Mở khóa'}>
                      {user.isActive ? <Lock size={16} color="#f59e0b" /> : <Unlock size={16} color="#10b981" />}
                    </button>
                    <button onClick={() => handleDelete(user._id, user.name)} style={actionButtonStyle} title="Xóa"><Trash2 size={16} color="#ef4444" /></button>
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
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Họ tên" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} required />
              {!editingUser && <input type="password" placeholder="Mật khẩu" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={inputStyle} required />}
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={inputStyle}>
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                Kích hoạt tài khoản
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...modalButtonStyle, backgroundColor: '#e5e7eb' }}>Hủy</button>
                <button type="submit" style={{ ...modalButtonStyle, backgroundColor: '#f97316', color: 'white' }}>{editingUser ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}