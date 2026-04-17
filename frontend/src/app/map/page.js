'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-lg font-semibold text-gray-600">Đang tải bản đồ...</div>
    </div>
  ),
});

export default function MapPage() {
  return <MapClient />;
}