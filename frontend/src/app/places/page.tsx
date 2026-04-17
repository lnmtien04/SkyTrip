'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Star, MapPin, TrendingUp, Sparkles,
  Waves, Mountain, Building2, Landmark, TreePine, Gamepad2, Hotel, Theater, Utensils
} from 'lucide-react';

interface Place {
  _id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  image: string;
  lat: number;
  lng: number;
  rating: number;
  viewCount: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

// Map icon theo tên danh mục
const getCategoryIcon = (name: string) => {
  const iconMap: { [key: string]: any } = {
    'Du lịch biển': Waves,
    'Du lịch núi': Mountain,
    'Du lịch thành phố': Building2,
    'Di tích lịch sử': Landmark,
    'Du lịch sinh thái': TreePine,
    'Khu vui chơi': Gamepad2,
    'Nghỉ dưỡng': Hotel,
    'Văn hóa – lễ hội': Theater,
    'Ẩm thực': Utensils,
  };
  return iconMap[name] || Sparkles;
};

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (res.ok) {
          const data = await res.json();
          const cats = Array.isArray(data) ? data : data.categories || [];
          setCategories(cats);
        } else {
          // Fallback nếu API lỗi
          setCategories([
            { _id: '1', name: 'Du lịch biển', slug: 'bien' },
            { _id: '2', name: 'Du lịch núi', slug: 'nui' },
            { _id: '3', name: 'Du lịch thành phố', slug: 'thanh-pho' },
            { _id: '4', name: 'Di tích lịch sử', slug: 'di-tich' },
            { _id: '5', name: 'Du lịch sinh thái', slug: 'sinh-thai' },
            
           
            { _id: '8', name: 'Văn hóa – lễ hội', slug: 'van-hoa' },
            { _id: '9', name: 'Ẩm thực', slug: 'am-thuc' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    fetchPlaces();
    fetchFeaturedPlaces();
  }, [search, category, currentPage]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(search && { search }),
        ...(category && { category }),
      });
      const res = await fetch(`${API_URL}/public/places?${params}`);
      const data = await res.json();
      setPlaces(data.places || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch places:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPlaces = async () => {
    try {
      const res = await fetch(`${API_URL}/public/places/featured`);
      const data = await res.json();
      setFeaturedPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch featured places:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (catName: string) => {
    setCategory(catName);
    setCurrentPage(1);
  };

  const SkeletonCard = () => (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ width: '100%', height: '180px', backgroundColor: '#e5e7eb', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '16px' }}>
        <div style={{ width: '70%', height: '20px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '90%', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '40%', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
      </div>
    </div>
  );

  // Styles
  const containerStyle: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' };
  const heroStyle: React.CSSProperties = { background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)', borderRadius: '24px', padding: '40px 32px', marginBottom: '40px', color: 'white', textAlign: 'center' };
  const heroTitleStyle: React.CSSProperties = { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' };
  const heroDescStyle: React.CSSProperties = { fontSize: '1.1rem', opacity: 0.9, marginBottom: '24px' };
  const searchContainerStyle: React.CSSProperties = { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' };
  const inputStyle: React.CSSProperties = { flex: 1, minWidth: '250px', padding: '14px 20px', borderRadius: '50px', border: 'none', outline: 'none', fontSize: '1rem', color: '#1f2937' };
  const searchButtonStyle: React.CSSProperties = { backgroundColor: 'white', color: '#f97316', padding: '14px 28px', borderRadius: '50px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' };
  const categoryFilterStyle: React.CSSProperties = { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '32px', justifyContent: 'flex-start', scrollbarWidth: 'thin' };
  const categoryBtnStyle = (isActive: boolean): React.CSSProperties => ({ padding: '8px 20px', borderRadius: '40px', border: isActive ? '2px solid #f97316' : '1px solid #e2e8f0', backgroundColor: isActive ? '#f97316' : 'white', color: isActive ? 'white' : '#374151', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' });
  const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' };
  const cardStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' };
  const imageStyle: React.CSSProperties = { width: '100%', height: '200px', objectFit: 'cover' };
  const cardContentStyle: React.CSSProperties = { padding: '16px' };
  const placeNameStyle: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '6px', color: '#1f2937' };
  const placeAddressStyle: React.CSSProperties = { fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' };
  const ratingStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontSize: '0.9rem' };
  const emptyStateStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '24px', marginBottom: '40px' };
  const sectionTitleStyle: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' };
  const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' };
  const pageBtnStyle = (disabled: boolean): React.CSSProperties => ({ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'white', color: disabled ? '#9ca3af' : '#374151', border: '1px solid #e2e8f0', cursor: disabled ? 'not-allowed' : 'pointer' });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const getImageUrl = (image: string) => {
    if (!image) return '/image/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return `http://localhost:5000/uploads/${image}`;
  };

  if (loading && places.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={gridStyle}>{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={heroStyle}>
        <div style={heroTitleStyle}>Khám phá Việt Nam</div>
        <div style={heroDescStyle}>Hàng ngàn điểm đến hấp dẫn đang chờ bạn</div>
        <form onSubmit={handleSearch} style={searchContainerStyle}>
          <input type="text" placeholder="Tìm kiếm địa điểm... (VD: Đà Lạt, Hạ Long)" value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />
          <button type="submit" style={searchButtonStyle}><Search size={18} /> Tìm kiếm</button>
        </form>
      </div>

      <div style={containerStyle}>
        {/* Các nút danh mục - không xuống dòng */}
        <div style={categoryFilterStyle}>
          <button onClick={() => handleCategoryChange('')} style={categoryBtnStyle(category === '')}>
            <Sparkles size={16} /> Tất cả
          </button>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.name)}
                style={categoryBtnStyle(category === cat.name)}
              >
                <Icon size={16} /> {cat.name}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={gridStyle}>{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : places.length > 0 ? (
          <>
            <div style={gridStyle}>
              {places.map((place) => (
                <Link href={`/places/${place._id}`} key={place._id} style={{ textDecoration: 'none' }}>
                  <div style={cardStyle} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                    <img src={getImageUrl(place.image)} alt={place.name} style={imageStyle} />
                    <div style={cardContentStyle}>
                      <div style={placeNameStyle}>{place.name}</div>
                      <div style={placeAddressStyle}><MapPin size={12} /> {place.address || 'Đang cập nhật'}</div>
                      <div style={ratingStyle}><Star size={14} fill="#f97316" stroke="none" /> {place.rating || 0} ({place.viewCount || 0} lượt xem)</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={pageBtnStyle(currentPage === 1)}>Trước</button>
                <span>Trang {currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={pageBtnStyle(currentPage === totalPages)}>Sau</button>
              </div>
            )}
          </>
        ) : (
          <div style={emptyStateStyle}>
            <Sparkles size={48} color="#f97316" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '16px' }}>Không tìm thấy địa điểm phù hợp</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Hãy thử tìm kiếm với từ khóa khác hoặc khám phá các địa điểm nổi bật bên dưới.</p>
            <button onClick={() => { setSearch(''); setCategory(''); setCurrentPage(1); }} style={{ backgroundColor: '#f97316', color: 'white', padding: '10px 24px', borderRadius: '40px', border: 'none', cursor: 'pointer', marginBottom: '40px' }}>Xem tất cả địa điểm</button>
            {featuredPlaces.length > 0 && (
              <>
                <div style={sectionTitleStyle}><TrendingUp size={24} color="#f97316" /> Địa điểm nổi bật</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginTop: '24px' }}>
                  {featuredPlaces.slice(0, 3).map((place) => (
                    <Link href={`/places/${place._id}`} key={place._id} style={{ textDecoration: 'none' }}>
                      <div style={cardStyle}>
                        <img src={getImageUrl(place.image)} alt={place.name} style={{ ...imageStyle, height: '160px' }} />
                        <div style={cardContentStyle}>
                          <div style={placeNameStyle}>{place.name}</div>
                          <div style={ratingStyle}><Star size={14} fill="#f97316" stroke="none" /> {place.rating || 0}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}