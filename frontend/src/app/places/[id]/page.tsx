// src/app/places/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Calendar, Eye, ChevronLeft, ChevronRight, Users, Map, Clock, Ticket } from 'lucide-react';

interface Place {
  _id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  image: string;
  images?: string[];
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  viewCount: number;
  createdAt: string;
  // Thông tin tour (mới)
  priceAdult?: number;
  priceChild?: number;
  priceInfant?: number;
  duration?: number;
  availableDates?: string[];
  pickupPoints?: string[];
}

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState<any>(null);

  const images = place?.images && place.images.length ? place.images : (place?.image ? [place.image] : []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, name: payload.name, email: payload.email });
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (!params?.id) {
      setError('Không tìm thấy địa điểm');
      setLoading(false);
      return;
    }
    fetchPlace();
  }, [params?.id]);

  const fetchPlace = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/public/places/${params.id}`);
      if (!res.ok) throw new Error('Không thể tải dữ liệu');
      const data = await res.json();
      setPlace(data);
      const relatedRes = await fetch(`${API_URL}/public/places?category=${data.category}&limit=3`);
      const relatedData = await relatedRes.json();
      setRelatedPlaces(relatedData.places?.filter((p: Place) => p._id !== data._id) || []);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: string) => {
    if (!image) return '/image/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/${image}`;
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleBookingClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/booking?placeId=${place?._id}`);
  };

  const formatPrice = (price?: number) => {
    if (!price) return '0 ₫';
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  // Kiểm tra có phải tour không (có giá và ngày khởi hành)
  const isTour = (place?.priceAdult && place?.priceAdult > 0) && (place?.availableDates && place.availableDates.length > 0);

  // Styles
  const containerStyle: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' };
  const breadcrumbStyle: React.CSSProperties = { fontSize: '0.9rem', color: '#6b7280', marginBottom: '24px' };
  const linkStyle: React.CSSProperties = { color: '#f97316', textDecoration: 'none' };
  const backButtonStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    backgroundColor: '#f97316', color: 'white', padding: '10px 20px',
    borderRadius: '40px', border: 'none', cursor: 'pointer', marginBottom: '24px'
  };
  const galleryContainerStyle: React.CSSProperties = { position: 'relative', marginBottom: '32px' };
  const mainImageStyle: React.CSSProperties = { width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const navButtonStyle: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
    borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };
  const thumbnailContainerStyle: React.CSSProperties = { display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto' };
  const thumbnailStyle = (isActive: boolean): React.CSSProperties => ({
    width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px',
    cursor: 'pointer', border: isActive ? '2px solid #f97316' : '1px solid #e5e7eb',
    opacity: isActive ? 1 : 0.7
  });
  const titleStyle: React.CSSProperties = { fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' };
  const infoRowStyle: React.CSSProperties = { display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' };
  const infoItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' };
  const sectionTitleStyle: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' };
  const descriptionStyle: React.CSSProperties = { marginBottom: '32px', lineHeight: '1.6', color: '#4b5563' };
  const tourInfoStyle: React.CSSProperties = { backgroundColor: '#f9fafb', borderRadius: '16px', padding: '20px', marginBottom: '32px' };
  const tourInfoGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '16px' };
  const tourInfoItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#374151' };
  const mapContainerStyle: React.CSSProperties = {
    height: '400px', width: '100%', backgroundColor: '#f3f4f6',
    borderRadius: '16px', overflow: 'hidden', marginBottom: '48px', position: 'relative'
  };
  const bookingButtonStyle: React.CSSProperties = { backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '40px', padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '16px' };
  const relatedGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '24px', marginTop: '24px' };
  const relatedCardStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer' };
  const relatedImageStyle: React.CSSProperties = { width: '100%', height: '160px', objectFit: 'cover' };
  const relatedContentStyle: React.CSSProperties = { padding: '12px' };
  const relatedNameStyle: React.CSSProperties = { fontSize: '1rem', fontWeight: 'bold', marginBottom: '4px' };

  if (loading) return <div style={containerStyle}>Đang tải...</div>;
  if (error) return <div style={{ ...containerStyle, color: 'red' }}>{error}</div>;
  if (!place) return <div style={containerStyle}>Không tìm thấy địa điểm</div>;

  return (
    <div style={containerStyle}>
      <button onClick={() => window.history.back()} style={backButtonStyle}>
        <ChevronLeft size={18} /> Quay lại
      </button>

      <div style={breadcrumbStyle}>
        <Link href="/" style={linkStyle}>Trang chủ</Link> /{' '}
        <Link href="/places" style={linkStyle}>Địa điểm</Link> /{' '}
        <span>{place.name}</span>
      </div>

      {images.length > 0 && (
        <div style={galleryContainerStyle}>
          <img src={getImageUrl(images[currentImageIndex])} alt={place.name} style={mainImageStyle} />
          {images.length > 1 && (
            <>
              <button onClick={prevImage} style={{ ...navButtonStyle, left: '10px' }}><ChevronLeft size={24} /></button>
              <button onClick={nextImage} style={{ ...navButtonStyle, right: '10px' }}><ChevronRight size={24} /></button>
            </>
          )}
          {images.length > 1 && (
            <div style={thumbnailContainerStyle}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`Thumb ${idx}`}
                  style={thumbnailStyle(currentImageIndex === idx)}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <h1 style={titleStyle}>{place.name}</h1>

      <div style={infoRowStyle}>
        <div style={infoItemStyle}><MapPin size={16} /> {place.address || 'Đang cập nhật'}</div>
        <div style={infoItemStyle}><Star size={16} fill="#f97316" stroke="none" /> {place.rating || 0} ({place.reviewCount || 0} đánh giá)</div>
        <div style={infoItemStyle}><Eye size={16} /> {place.viewCount || 0} lượt xem</div>
        <div style={infoItemStyle}><Calendar size={16} /> {new Date(place.createdAt).toLocaleDateString('vi-VN')}</div>
      </div>

      {/* Thông tin tour nếu có */}
      {isTour && (
        <div style={tourInfoStyle}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={20} color="#f97316" /> Thông tin tour
          </h3>
          <div style={tourInfoGridStyle}>
            {place.priceAdult && place.priceAdult > 0 && (
              <div style={tourInfoItemStyle}><Users size={16} /> Người lớn: {formatPrice(place.priceAdult)}</div>
            )}
            {place.priceChild && place.priceChild > 0 && (
              <div style={tourInfoItemStyle}><Users size={16} /> Trẻ em (6-11 tuổi): {formatPrice(place.priceChild)}</div>
            )}
            {place.priceInfant && place.priceInfant > 0 && (
              <div style={tourInfoItemStyle}><Users size={16} /> Em bé (&lt;6 tuổi): {formatPrice(place.priceInfant)}</div>
            )}
            {place.duration && place.duration > 0 && (
              <div style={tourInfoItemStyle}><Calendar size={16} /> Số ngày: {place.duration}</div>
            )}
            {place.availableDates && place.availableDates.length > 0 && (
              <div style={tourInfoItemStyle}><Clock size={16} /> Ngày khởi hành: {place.availableDates.map(d => new Date(d).toLocaleDateString('vi-VN')).join(', ')}</div>
            )}
            {place.pickupPoints && place.pickupPoints.length > 0 && (
              <div style={tourInfoItemStyle}><Map size={16} /> Điểm đón: {place.pickupPoints.join(', ')}</div>
            )}
          </div>
        </div>
      )}

      <h2 style={sectionTitleStyle}>Giới thiệu</h2>
      <div style={descriptionStyle}>{place.description || 'Chưa có mô tả chi tiết.'}</div>

      {/* Nút đặt tour chỉ hiển thị nếu là tour */}
      {isTour && (
        <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '32px' }}>
          <button onClick={handleBookingClick} style={bookingButtonStyle}>
            Đặt tour ngay
          </button>
        </div>
      )}

      <h2 style={sectionTitleStyle}>Vị trí trên bản đồ</h2>
      <div style={mapContainerStyle}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng - 0.02}%2C${place.lat - 0.02}%2C${place.lng + 0.02}%2C${place.lat + 0.02}&layer=mapnik&marker=${place.lat}%2C${place.lng}`}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          title="Bản đồ vị trí"
        />
      </div>

      {relatedPlaces.length > 0 && (
        <>
          <h2 style={sectionTitleStyle}>Địa điểm bạn có thể thích</h2>
          <div style={relatedGridStyle}>
            {relatedPlaces.map((rel) => (
              <Link href={`/places/${rel._id}`} key={rel._id} style={{ textDecoration: 'none' }}>
                <div
                  style={relatedCardStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <img src={getImageUrl(rel.image)} alt={rel.name} style={relatedImageStyle} />
                  <div style={relatedContentStyle}>
                    <div style={relatedNameStyle}>{rel.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontSize: '0.85rem' }}>
                      <Star size={12} fill="#f97316" stroke="none" /> {rel.rating || 0}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}