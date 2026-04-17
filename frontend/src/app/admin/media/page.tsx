'use client';

import { useState, useEffect } from 'react';
import { Upload, Trash2, Image, X } from 'lucide-react';

interface MediaFile {
  filename: string;
  url: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const fileList = Array.isArray(data) ? data : [];
      setFiles(fileList.map((f: string) => ({
        filename: f,
        url: `${API_URL.replace('/api', '')}/uploads/${f}`,
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      const newFiles = Array.isArray(data) ? data : [];
      setFiles(prev => [
        ...newFiles.map((f: string) => ({
          filename: f,
          url: `${API_URL.replace('/api', '')}/uploads/${f}`,
        })),
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const deleteImage = async (filename: string) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/admin/media/${filename}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(prev => prev.filter(f => f.filename !== filename));
    } catch (error) {
      console.error(error);
    }
  };

  // Styles (inline style đồng bộ với admin)
  const containerStyle: React.CSSProperties = { padding: '24px' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
  const titleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' };
  const uploadAreaStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb', textAlign: 'center' };
  const uploadButtonStyle: React.CSSProperties = { backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' };
  const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' };
  const cardStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative', border: '1px solid #e5e7eb' };
  const imageStyle: React.CSSProperties = { width: '100%', height: '160px', objectFit: 'cover' };
  const deleteButtonStyle: React.CSSProperties = { position: 'absolute', top: '8px', right: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.8 };

  if (loading) return <div style={containerStyle}>Đang tải...</div>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Thư viện Media</h1>
      </div>

      <div style={uploadAreaStyle}>
        <label htmlFor="file-upload" style={uploadButtonStyle}>
          <Upload size={18} /> Chọn ảnh tải lên
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
        {uploading && <div style={{ marginTop: '12px', color: '#f97316' }}>Đang tải lên...</div>}
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>Hỗ trợ JPG, PNG, GIF. Dung lượng tối đa 5MB mỗi ảnh.</p>
      </div>

      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <Image size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#6b7280' }}>Chưa có ảnh nào. Hãy tải lên ảnh đầu tiên!</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {files.map((file) => (
            <div key={file.filename} style={cardStyle}>
              <img src={file.url} alt={file.filename} style={imageStyle} />
              <button
                onClick={() => deleteImage(file.filename)}
                style={deleteButtonStyle}
                title="Xóa ảnh"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}