'use client';

interface TravelMapProps {
  places?: any[];
}

export default function TravelMap({ places = [] }: TravelMapProps) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Bản đồ địa điểm</h2>
      <p>Số lượng địa điểm: {places.length}</p>
      <p className="text-sm text-gray-500">Tính năng đang được phát triển.</p>
    </div>
  );
}