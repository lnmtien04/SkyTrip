'use client';
import '../globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Tag,
  Compass,
  Calendar,
  Star,
  Image,
  File,
  BarChart3,
  Download,
  Mail,
  Home, // thêm icon Home
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // import useAuth

const menuItems = [
  { name: 'Trang chủ', href: '/', icon: Home }, // thêm mục mới
  { name: 'Tổng quan hệ thống', href: '/admin', icon: LayoutDashboard },
  { name: 'Quản lý tài khoản', href: '/admin/users', icon: Users },
  { name: 'Quản lý địa điểm', href: '/admin/locations', icon: MapPin },
  { name: 'Quản lý nội dung', href: '/admin/posts', icon: FileText },
  { name: 'Quản lý danh mục', href: '/admin/categories', icon: Tag },
  { name: 'Quản lý đặt chỗ', href: '/admin/bookings', icon: Calendar },
  { name: 'Quản lý đánh giá', href: '/admin/reviews', icon: Star },
  { name: 'Quản lý media', href: '/admin/media', icon: Image },
  { name: 'Quản lý trang ', href: '/admin/pages', icon: File },
  { name: 'Thống kê', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Cấu hình hệ thống', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth(); // lấy hàm logout

  const handleLogout = () => {
    logout();
    router.push('/login'); // chuyển hướng về login sau khi logout
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex' }}>
      {/* Sidebar cố định */}
      <aside style={{ width: 280, backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#f97316', padding: '8px', borderRadius: '12px' }}>
            <Compass size={22} color="white" />
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '-0.5px' }}>SkyTrip Admin</span>
        </div>

        {/* Admin info card */}
        <div style={{ margin: '20px 16px 0 16px', padding: '12px', background: 'linear-gradient(135deg, #fff7ed, #fee2e2)', borderRadius: '16px', border: '1px solid #fed7aa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>A</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '15px' }}>Admin</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Quản trị viên cấp cao</p>
            </div>
          </div>
        </div>

        {/* Menu items - mỗi item là card, không có mô tả */}
        <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'block',
                  borderRadius: '14px',
                  border: `2px solid ${isActive ? '#f97316' : '#e5e7eb'}`,
                  backgroundColor: isActive ? '#fff7ed' : 'white',
                  boxShadow: isActive ? '0 4px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px' }}>
                  <div style={{ 
                    padding: '8px', 
                    borderRadius: '12px', 
                    backgroundColor: isActive ? '#ffedd5' : '#f3f4f6',
                    transition: 'all 0.2s'
                  }}>
                    <item.icon size={20} color={isActive ? '#ea580c' : '#6b7280'} />
                  </div>
                  <span style={{ 
                    fontWeight: 500, 
                    fontSize: '15px', 
                    color: isActive ? '#c2410c' : '#374151',
                    letterSpacing: '-0.3px'
                  }}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout card */}
        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleLogout} // thêm sự kiện onClick
            style={{
              width: '100%',
              borderRadius: '14px',
              border: '2px solid #fecaca',
              backgroundColor: '#fef2f2',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={18} color="#dc2626" />
            <span style={{ fontWeight: 500, color: '#dc2626', fontSize: '14px' }}>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '40px', padding: '6px 14px', border: '1px solid #e5e7eb' }}>
            <Search size={16} color="#9ca3af" />
            <input type="text" placeholder="Tìm kiếm..." style={{ background: 'transparent', marginLeft: '8px', outline: 'none', fontSize: '14px', width: '180px', color: '#374151' }} />
          </div>
          <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
            <Bell size={18} color="#4b5563" />
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '10px', borderLeft: '1px solid #e5e7eb' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <User size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Xin chào, Admin</span>
          </div>
        </header>
        <main style={{ padding: '24px', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}