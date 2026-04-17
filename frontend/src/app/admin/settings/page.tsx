'use client';

import { useState, useEffect } from 'react';
import { Save, Globe, Palette, Phone, Shield, Image, Monitor } from 'lucide-react';

interface Settings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  bannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebook: string;
  instagram: string;
  youtube: string;
  itemsPerPage: number;
  showRating: boolean;
  showComments: boolean;
  maintenanceMode: boolean;
  theme: string;
  primaryColor: string;
  metaTitle: string;
  metaDescription: string;
  footerCopyright: string;
  footerContent: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [uploading, setUploading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Lưu cài đặt thành công');
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('images', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data[0]) {
        setSettings(prev => ({ ...prev!, [field]: data[0] }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  if (!settings) return <div className="text-center p-10">Không thể tải cài đặt</div>;

  const tabs = [
    { id: 'general', name: 'Thông tin chung', icon: Globe },
    { id: 'appearance', name: 'Giao diện', icon: Palette },
    { id: 'contact', name: 'Liên hệ & MXH', icon: Phone },
    { id: 'system', name: 'Hệ thống', icon: Shield },
  ];

  // Styles inline (giống các trang admin khác)
  const containerStyle: React.CSSProperties = { padding: '24px' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
  const titleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' };
  const saveButtonStyle: React.CSSProperties = { backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
  const tabContainerStyle: React.CSSProperties = { display: 'flex', gap: '8px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' };
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    backgroundColor: active ? '#f97316' : 'transparent',
    color: active ? 'white' : '#6b7280',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
  });
  const formGroupStyle: React.CSSProperties = { marginBottom: '20px' };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' };
  const checkboxStyle: React.CSSProperties = { marginRight: '8px', transform: 'scale(1.1)' };
  const rowStyle: React.CSSProperties = { display: 'flex', gap: '16px', flexWrap: 'wrap' };
  const halfInputStyle: React.CSSProperties = { ...inputStyle, width: 'calc(50% - 8px)' };
  const imagePreviewStyle: React.CSSProperties = { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Cài đặt hệ thống</h1>
        <button onClick={handleSave} disabled={saving} style={saveButtonStyle}>
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Tabs */}
      <div style={tabContainerStyle}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(activeTab === tab.id)}>
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: '800px' }}>
        {/* Thông tin chung */}
        {activeTab === 'general' && (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Tên website</label>
              <input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Mô tả website</label>
              <textarea value={settings.siteDescription} onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} rows={3} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Logo</label>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'logo')} style={{ marginBottom: '8px' }} />
              {uploading && <span>Đang tải...</span>}
              {settings.logo && <img src={`${API_URL}/uploads/${settings.logo}`} alt="logo" style={imagePreviewStyle} />}
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Favicon</label>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'favicon')} />
              {settings.favicon && <img src={`${API_URL}/uploads/${settings.favicon}`} alt="favicon" style={{ width: '32px', height: '32px', marginTop: '8px' }} />}
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Meta Title (SEO)</label>
              <input type="text" value={settings.metaTitle} onChange={e => setSettings({ ...settings, metaTitle: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Meta Description (SEO)</label>
              <textarea value={settings.metaDescription} onChange={e => setSettings({ ...settings, metaDescription: e.target.value })} rows={2} style={inputStyle} />
            </div>
          </>
        )}

        {/* Giao diện */}
        {activeTab === 'appearance' && (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Ảnh banner trang chủ</label>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'bannerImage')} />
              {settings.bannerImage && <img src={`${API_URL}/uploads/${settings.bannerImage}`} alt="banner" style={imagePreviewStyle} />}
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Tiêu đề banner</label>
              <input type="text" value={settings.bannerTitle} onChange={e => setSettings({ ...settings, bannerTitle: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Phụ đề banner</label>
              <input type="text" value={settings.bannerSubtitle} onChange={e => setSettings({ ...settings, bannerSubtitle: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Số địa điểm hiển thị mỗi trang</label>
              <input type="number" value={settings.itemsPerPage} onChange={e => setSettings({ ...settings, itemsPerPage: parseInt(e.target.value) })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Màu chủ đạo</label>
              <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} style={{ width: '60px', height: '40px' }} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Chế độ giao diện</label>
              <select value={settings.theme} onChange={e => setSettings({ ...settings, theme: e.target.value })} style={inputStyle}>
                <option value="light">Sáng</option>
                <option value="dark">Tối</option>
              </select>
            </div>
            <div style={formGroupStyle}>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={settings.showRating} onChange={e => setSettings({ ...settings, showRating: e.target.checked })} style={checkboxStyle} />
                Hiển thị đánh giá (rating)
              </label>
            </div>
            <div style={formGroupStyle}>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={settings.showComments} onChange={e => setSettings({ ...settings, showComments: e.target.checked })} style={checkboxStyle} />
                Bật chức năng bình luận
              </label>
            </div>
          </>
        )}

        {/* Liên hệ & MXH */}
        {activeTab === 'contact' && (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email liên hệ</label>
              <input type="email" value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Số điện thoại</label>
              <input type="text" value={settings.contactPhone} onChange={e => setSettings({ ...settings, contactPhone: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Địa chỉ công ty</label>
              <input type="text" value={settings.contactAddress} onChange={e => setSettings({ ...settings, contactAddress: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Facebook</label>
              <input type="text" value={settings.facebook} onChange={e => setSettings({ ...settings, facebook: e.target.value })} style={inputStyle} placeholder="https://facebook.com/..." />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Instagram</label>
              <input type="text" value={settings.instagram} onChange={e => setSettings({ ...settings, instagram: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Youtube</label>
              <input type="text" value={settings.youtube} onChange={e => setSettings({ ...settings, youtube: e.target.value })} style={inputStyle} />
            </div>
          </>
        )}

        {/* Hệ thống */}
        {activeTab === 'system' && (
          <>
            <div style={formGroupStyle}>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} style={checkboxStyle} />
                Chế độ bảo trì (Bật/Tắt website)
              </label>
              {settings.maintenanceMode && <div style={{ marginTop: '8px', color: '#dc2626', fontSize: '14px' }}>Website đang trong chế độ bảo trì. Người dùng sẽ thấy thông báo bảo trì.</div>}
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Footer - Nội dung bản quyền</label>
              <input type="text" value={settings.footerCopyright} onChange={e => setSettings({ ...settings, footerCopyright: e.target.value })} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Footer - Nội dung bổ sung</label>
              <textarea value={settings.footerContent} onChange={e => setSettings({ ...settings, footerContent: e.target.value })} rows={3} style={inputStyle} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}