'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const TravelMap = dynamic(() => import('@/components/TravelMap'), { ssr: false });

export default function AdminMapPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch('/api/admin/places')
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý bản đồ</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <TravelMap places={places} />
      </div>
    </div>
  );
}