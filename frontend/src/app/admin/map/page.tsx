'use client';
import { useState, useEffect } from 'react';

export default function AdminMapPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch('/api/admin/places')
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Quản lý bản đồ</h1>
      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <p>Bản đồ đang được phát triển. Số lượng địa điểm: {places.length}</p>
        {/* Sau này có thể thêm Google Maps hoặc Leaflet */}
      </div>
    </div>
  );
}