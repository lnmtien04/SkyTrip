"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { Home as HomeIcon, MapPin, Map, Info, LogIn, UserPlus, ChevronLeft, ChevronRight, Play, User, Star } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // State cho dữ liệu từ API
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  // State cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const images = [
    '/image/03.jpg',
    '/image/04.jpg',
    '/image/05.jpg',
    '/image/06.jpg',
    '/image/07.jpg',
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch dữ liệu từ API public
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, postsRes, reviewsRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/public/places/featured`),
          fetch(`${API_URL}/public/posts/recent`),
          fetch(`${API_URL}/public/reviews/recent`),
          fetch(`${API_URL}/public/settings`)
        ]);
        
        const placesData = await placesRes.json();
        const postsData = await postsRes.json();
        const reviewsData = await reviewsRes.json();
        const settingsData = await settingsRes.json();
        
        setFeaturedPlaces(Array.isArray(placesData) ? placesData : []);
        setRecentPosts(Array.isArray(postsData) ? postsData : []);
        setRecentReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setSettings(settingsData);
      } catch (error) {
        console.error('Lỗi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [API_URL]);

  // Gợi ý tìm kiếm (debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/public/places?search=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await res.json();
        setSearchSuggestions(data.places || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, API_URL]);

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/places?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (placeName: string) => {
    setSearchQuery(placeName);
    setShowSuggestions(false);
    router.push(`/places?search=${encodeURIComponent(placeName)}`);
  };

  // Carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isAdmin = user && user.role === 'admin';

  // Styles (giữ nguyên)
  const headerContainerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #e2e8f0',
  } as React.CSSProperties;

  const innerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '64px',
    gap: '12px',
  } as React.CSSProperties;

  const buttonMenuStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#000000',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
    transition: 'all 0.2s',
    textDecoration: 'none',
  } as React.CSSProperties;

  const loginBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f97316',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
    transition: 'all 0.2s',
    textDecoration: 'none',
  } as React.CSSProperties;

  const registerBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#ffffff',
    border: '1px solid #f97316',
    borderRadius: '8px',
    color: '#f97316',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
    transition: 'all 0.2s',
    textDecoration: 'none',
  } as React.CSSProperties;

  const userInfoStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    color: '#000000',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
  } as React.CSSProperties;

  const logoutBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f97316',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
    transition: 'all 0.2s',
  } as React.CSSProperties;

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#f97316',
  } as React.CSSProperties;

  const categoryButtonStyle = {
    ...buttonMenuStyle,
    padding: '8px 16px',
    fontWeight: '500',
  } as React.CSSProperties;

  const categories = [
    'Khu vực phổ biến',
    'Điểm đến phổ biến',
    'Địa danh phổ biến',
    'Khám phá SkyTrip'
  ];

  // Carousel styles
  const carouselContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '65vh',
    overflow: 'hidden',
  } as React.CSSProperties;

  const slideStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${images[currentIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 0.5s ease-in-out',
  } as React.CSSProperties;

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 2,
  } as React.CSSProperties;

  const contentStyle = {
    position: 'relative',
    zIndex: 3,
    maxWidth: '1280px',
    margin: '0 auto',
    textAlign: 'left',
    padding: '0 24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  } as React.CSSProperties;

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#ffffff',
    textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
  } as React.CSSProperties;

  const descriptionStyle = {
    fontSize: '1.35rem',
    color: '#ffffff',
    maxWidth: '42rem',
    margin: '0 0 2rem 0',
    textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
  } as React.CSSProperties;

  const searchContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '1rem',
    flexWrap: 'wrap',
    position: 'relative',
  } as React.CSSProperties;

  const inputStyle = {
    width: '30rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    outline: 'none',
    backgroundColor: 'white',
    color: '#1f2937',
  } as React.CSSProperties;

  const searchButtonStyle = {
    backgroundColor: '#f97316',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
  } as React.CSSProperties;

  const suggestionsStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 50,
    overflow: 'hidden',
  } as React.CSSProperties;

  const suggestionItemStyle = {
    padding: '10px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties;

  const arrowButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 4,
    transition: 'background-color 0.2s',
  } as React.CSSProperties;

  const leftArrowStyle = {
    ...arrowButtonStyle,
    left: '20px',
  } as React.CSSProperties;

  const rightArrowStyle = {
    ...arrowButtonStyle,
    right: '20px',
  } as React.CSSProperties;

  const dotsContainerStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 4,
  } as React.CSSProperties;

  const dotStyle = (isActive: boolean) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isActive ? '#f97316' : 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties);

  // Phần ưu đãi (mock)
  const offersContainerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '48px 24px 24px 24px',
  } as React.CSSProperties;

  const offersTitleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginBottom: '24px',
  } as React.CSSProperties;

  const offersGridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    justifyContent: 'space-between',
  } as React.CSSProperties;

  const offerCardStyle = {
    flex: '1',
    minWidth: '200px',
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  } as React.CSSProperties;

  const offerImageStyle = {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  } as React.CSSProperties;

  const offerContentStyle = {
    padding: '16px',
  } as React.CSSProperties;

  const offerCardTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#1f2937',
  } as React.CSSProperties;

  const offerDescStyle = {
    fontSize: '0.9rem',
    color: '#6b7280',
  } as React.CSSProperties;

  const offers = [
    { image: '/image/08.jpg', title: 'Ưu đãi đặc biệt', desc: 'Giảm 30% cho đặt phòng đầu tiên' },
    { image: '/image/09.jpg', title: 'Tour hè 2025', desc: 'Combo tiết kiệm lên đến 1.000.000đ' },
    { image: '/image/10.jpg', title: 'Vé máy bay giá rẻ', desc: 'Bay khắp Đông Nam Á chỉ từ 99k' },
    { image: '/image/11.jpg', title: 'Khám phá văn hóa', desc: 'Trải nghiệm bản địa độc đáo' },
  ];

  // Phần địa điểm nổi bật
  const sectionStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '48px 24px 24px 24px',
  } as React.CSSProperties;

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '24px',
  } as React.CSSProperties;

  const sectionTitleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#000000',
  } as React.CSSProperties;

  const seeMoreStyle = {
    fontSize: '0.9rem',
    color: '#f97316',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  } as React.CSSProperties;

  const placesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  } as React.CSSProperties;

  const placeCardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  } as React.CSSProperties;

  const placeImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  } as React.CSSProperties;

  const placeInfoStyle = {
    padding: '16px',
  } as React.CSSProperties;

  const placeNameStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#1f2937',
  } as React.CSSProperties;

  const placeCategoryStyle = {
    fontSize: '0.85rem',
    color: '#f97316',
    marginBottom: '4px',
  } as React.CSSProperties;

  const placeRatingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
    fontSize: '0.85rem',
    color: '#fbbf24',
  } as React.CSSProperties;

  // Video section
  const videoGridStyle = {
    display: 'flex',
    overflowX: 'auto',
    gap: '20px',
    paddingBottom: '8px',
    scrollbarWidth: 'thin',
  } as React.CSSProperties;

  const videoCardStyle = {
    flex: '0 0 auto',
    width: '320px',
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  } as React.CSSProperties;

  const videoThumbStyle = {
    position: 'relative',
    width: '100%',
    height: '200px',
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  } as React.CSSProperties;

  const videoImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as React.CSSProperties;

  const playIconStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: '50%',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties;

  const videos = [
    { image: '/image/video1.jpg' },
    { image: '/image/video2.jpg' },
    { image: '/image/video3.jpg' },
    { image: '/image/video4.jpg' },
    { image: '/image/video5.jpg' },
    { image: '/image/video6.jpg' },
  ];

  // Dropdown styles
  const dropdownContainerStyle = {
    position: 'relative',
    display: 'inline-block',
  } as React.CSSProperties;

  const adminButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#f97316',
    border: 'none',
    borderRadius: '9999px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  } as React.CSSProperties;

  const dropdownMenuStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
    minWidth: '200px',
    zIndex: 1000,
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
  } as React.CSSProperties;

  const dropdownLinkStyle = {
    display: 'block',
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#1f2937',
    fontSize: '0.9rem',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background 0.2s',
  } as React.CSSProperties;

  const dropdownLogoutStyle = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  } as React.CSSProperties;

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff)' }}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <div style={innerStyle}>
          <div style={logoStyle}>SkyTrip</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={buttonMenuStyle}><HomeIcon size={18} /> Trang chủ</Link>
            <Link href="/places" style={buttonMenuStyle}><MapPin size={18} /> Địa điểm</Link>
            <Link href="/map" style={buttonMenuStyle}><Map size={18} /> Bản đồ</Link>
            <Link href="/about" style={buttonMenuStyle}><Info size={18} /> Giới thiệu</Link>

            {user ? (
              isAdmin ? (
                <div style={dropdownContainerStyle}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} style={adminButtonStyle}>
                    <User size={16} /> {user.name || user.email}
                  </button>
                  {dropdownOpen && (
                    <div style={dropdownMenuStyle}>
                      <Link href="/admin" style={dropdownLinkStyle} onClick={() => setDropdownOpen(false)}>Quản trị hệ thống</Link>
                      <button onClick={() => { setDropdownOpen(false); logout(); }} style={dropdownLogoutStyle}>Đăng xuất</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div style={userInfoStyle}><User size={18} /> {user.name || user.email}</div>
                  <button onClick={logout} style={logoutBtnStyle}>Đăng xuất</button>
                </>
              )
            ) : (
              <>
                <Link href="/login" style={loginBtnStyle}><LogIn size={18} /> Đăng nhập</Link>
                <Link href="/register" style={registerBtnStyle}><UserPlus size={18} /> Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', borderBottom: '1px solid #eef2f6' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-start' }}>
            {categories.map((cat) => (
              <Link key={cat} href={`/places?category=${encodeURIComponent(cat)}`} style={categoryButtonStyle}>{cat}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div style={carouselContainerStyle}>
        <div style={slideStyle}></div>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <h1 style={titleStyle}>THẾ GIỚI TRỌN NIỀM VUI</h1>
          <p style={descriptionStyle}>Khám phá niềm vui của bạn mọi lúc, mọi nơi - từ chuyến du lịch ngẫu hứng tới những cuộc phiêu lưu khắp thế giới</p>
          <div style={searchContainerStyle}>
            <input
              type="text"
              placeholder="Bạn muốn đi đâu?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleSearch} style={searchButtonStyle}>Tìm kiếm</button>
            {showSuggestions && searchSuggestions.length > 0 && (
              <div style={suggestionsStyle}>
                {searchSuggestions.map((place) => (
                  <div
                    key={place._id}
                    style={suggestionItemStyle}
                    onClick={() => handleSuggestionClick(place.name)}
                  >
                    <MapPin size={16} color="#f97316" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{place.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{place.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={prevSlide} style={leftArrowStyle}><ChevronLeft size={24} /></button>
        <button onClick={nextSlide} style={rightArrowStyle}><ChevronRight size={24} /></button>
        <div style={dotsContainerStyle}>
          {images.map((_, idx) => <div key={idx} style={dotStyle(currentIndex === idx)} onClick={() => setCurrentIndex(idx)} />)}
        </div>
      </div>

      {/* Phần còn lại giữ nguyên... */}
      <div style={offersContainerStyle}>
        <h2 style={offersTitleStyle}>Ưu đãi dành cho bạn</h2>
        <div style={offersGridStyle}>
          {offers.map((offer, idx) => (
            <div key={idx} style={offerCardStyle} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <img src={offer.image} alt={offer.title} style={offerImageStyle} />
              <div style={offerContentStyle}>
                <h3 style={offerCardTitleStyle}>{offer.title}</h3>
                <p style={offerDescStyle}>{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Địa điểm nổi bật</h2>
          <Link href="/places" style={seeMoreStyle}>Xem thêm →</Link>
        </div>
        <div style={placesGridStyle}>
          {featuredPlaces.map((place) => (
            <Link href={`/places/${place._id}`} key={place._id} style={{ textDecoration: 'none' }}>
              <div style={placeCardStyle} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                <img src={place.image ? `${API_URL.replace('/api', '')}/uploads/${place.image}` : '/image/placeholder.jpg'} alt={place.name} style={placeImageStyle} />
                <div style={placeInfoStyle}>
                  <div style={placeCategoryStyle}>{place.category}</div>
                  <div style={placeNameStyle}>{place.name}</div>
                  <div style={placeRatingStyle}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(place.rating) ? '#fbbf24' : 'none'} color="#fbbf24" />
                    ))}
                    <span style={{ marginLeft: '4px', color: '#6b7280' }}>({place.rating || 0})</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Bài viết mới</h2>
          <Link href="/posts" style={seeMoreStyle}>Xem thêm →</Link>
        </div>
        <div style={placesGridStyle}>
          {recentPosts.map((post) => (
            <Link href={`/posts/${post._id}`} key={post._id} style={{ textDecoration: 'none' }}>
              <div style={placeCardStyle} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                {post.image && <img src={`${API_URL.replace('/api', '')}/uploads/${post.image}`} alt={post.title} style={placeImageStyle} />}
                <div style={placeInfoStyle}>
                  <div style={placeNameStyle}>{post.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>{post.excerpt?.substring(0, 100)}...</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {recentReviews.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>Đánh giá gần đây</h2>
            <Link href="/reviews" style={seeMoreStyle}>Xem thêm →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {recentReviews.map((review) => (
              <div key={review._id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    {review.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{review.user?.name || 'Người dùng'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#f97316' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? '#f97316' : 'none'} color="#f97316" />
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ color: '#4b5563', lineHeight: 1.5 }}>{review.comment?.substring(0, 120)}...</p>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '12px' }}>
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')} - {review.place?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Khám phá qua video</h2>
          <Link href="#" style={seeMoreStyle}>Xem thêm →</Link>
        </div>
        <div style={videoGridStyle}>
          {videos.map((video, idx) => (
            <div key={idx} style={videoCardStyle} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={videoThumbStyle}>
                <img src={video.image} alt="video" style={videoImageStyle} />
                <div style={playIconStyle}><Play size={32} color="white" fill="white" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}