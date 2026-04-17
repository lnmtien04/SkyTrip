'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Search } from 'lucide-react';

export default function ManagePlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Thay bằng fetch thật: fetch('/api/admin/places')
    setTimeout(() => {
      setPlaces([
        { _id: 1, name: 'Vịnh Hạ Long', description: 'Di sản thiên nhiên thế giới', category: { name: 'Thiên nhiên' }, rating: 4.9 },
        { _id: 2, name: 'Phố cổ Hội An', description: 'Di sản văn hóa', category: { name: 'Văn hóa' }, rating: 4.8 },
        { _id: 3, name: 'Thánh địa Mỹ Sơn', description: 'Khu đền tháp Chăm', category: { name: 'Lịch sử' }, rating: 4.6 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Quản lý địa điểm</h1>
        <p className="text-gray-500">Thêm, sửa, xóa các điểm du lịch</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Tìm kiếm..." className="w-full pl-9 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" />
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:shadow-md">
          <Plus size={18} /> Thêm địa điểm
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map(place => (
            <div key={place._id} className="bg-white rounded-2xl shadow-lg border overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-blue-400" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{place.name}</h3>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded-full"><Edit size={16} /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded-full"><Trash2 size={16} className="text-red-500" /></button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">{place.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{place.category.name}</span>
                  <span className="text-xs text-gray-400">⭐ {place.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}