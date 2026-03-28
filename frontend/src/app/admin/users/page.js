'use client';
import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, toggleUserActive } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [page, user, loading]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=10`);
      setUsers(res.data.users);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !currentStatus });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const changeRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Vai trò</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-white ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                    {u.isActive ? 'Hoạt động' : 'Khóa'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleStatus(u._id, u.isActive)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    {u.isActive ? 'Khóa' : 'Mở khóa'}
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-1">Trang {page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}