"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { Home as HomeIcon, MapPin, Map, Info, LogIn, UserPlus, ChevronLeft, ChevronRight, Play, User, Star, CheckCircle, ThumbsUp, CreditCard, Headphones } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch dữ liệu
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

  // Gợi ý tìm kiếm
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const isAdmin = user && user.role === 'admin';

  // ---------- STYLES với kiểu React.CSSProperties ----------
  const headerContainerStyle: React.CSSProperties = { 
    position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255,255,255,0.9)', 
    backdropFilter: 'blur(8px)', borderBottom: '1px solid #e2e8f0' 
  };
  const innerStyle: React.CSSProperties = { 
    maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', 
    flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', 
    minHeight: '64px', gap: '12px' 
  };
  const buttonMenuStyle: React.CSSProperties = { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
    background: 'transparent', border: 'none', borderRadius: '8px', color: '#000', 
    cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '1rem', transition: 'all 0.2s', 
    textDecoration: 'none' 
  };
  const loginBtnStyle: React.CSSProperties = { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
    background: '#f97316', border: 'none', borderRadius: '8px', color: '#fff', 
    cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '1rem', textDecoration: 'none' 
  };
  const registerBtnStyle: React.CSSProperties = { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
    background: '#fff', border: '1px solid #f97316', borderRadius: '8px', color: '#f97316', 
    cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '1rem', textDecoration: 'none' 
  };
  const userInfoStyle: React.CSSProperties = { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
    color: '#000', whiteSpace: 'nowrap', fontSize: '1rem' 
  };
  const logoutBtnStyle: React.CSSProperties = { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
    background: '#f97316', border: 'none', borderRadius: '8px', color: '#fff', 
    cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '1rem' 
  };
  const logoStyle: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' };
  const categoryButtonStyle: React.CSSProperties = { ...buttonMenuStyle, padding: '8px 16px', fontWeight: '500' };
  const categories = ['Khu vực phổ biến', 'Điểm đến phổ biến', 'Địa danh phổ biến', 'Khám phá SkyTrip'];

  const carouselContainerStyle: React.CSSProperties = { position: 'relative', width: '100%', height: '65vh', overflow: 'hidden' };
  const slideStyle: React.CSSProperties = { 
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
    backgroundImage: `url(${images[currentIndex]})`, backgroundSize: 'cover', 
    backgroundPosition: 'center', transition: 'background-image 0.5s ease-in-out' 
  };
  const overlayStyle: React.CSSProperties = { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 2 
  };
  const contentStyle: React.CSSProperties = { 
    position: 'relative', zIndex: 3, maxWidth: '1280px', margin: '0 auto', 
    textAlign: 'left', padding: '0 24px', height: '100%', display: 'flex', 
    flexDirection: 'column', justifyContent: 'center' 
  };
  const titleStyle: React.CSSProperties = { 
    fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff', 
    textShadow: '2px 2px 8px rgba(0,0,0,0.5)' 
  };
  const descriptionStyle: React.CSSProperties = { 
    fontSize: '1.35rem', color: '#fff', maxWidth: '42rem', margin: '0 0 2rem 0', 
    textShadow: '1px 1px 4px rgba(0,0,0,0.5)' 
  };
  const searchContainerStyle: React.CSSProperties = { 
    display: 'flex', justifyContent: 'flex-start', gap: '1rem', flexWrap: 'wrap', position: 'relative' 
  };
  const inputStyle: React.CSSProperties = { 
    width: '30rem', padding: '0.75rem 1.5rem', borderRadius: '14px', border: '1px solid #d1d5db', 
    outline: 'none', backgroundColor: 'white', color: '#1f2937' 
  };
  const searchButtonStyle: React.CSSProperties = { 
    backgroundColor: '#f97316', color: 'white', padding: '0.75rem 2rem', 
    borderRadius: '12px', border: 'none', cursor: 'pointer' 
  };
  const suggestionsStyle: React.CSSProperties = { 
    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, 
    backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
    zIndex: 50, overflow: 'hidden' 
  };
  const suggestionItemStyle: React.CSSProperties = { 
    padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #e5e7eb', 
    display: 'flex', alignItems: 'center', gap: '8px' 
  };
  const arrowButtonStyle: React.CSSProperties = { 
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', 
    backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', 
    borderRadius: '50%', width: '40px', height: '40px', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 4 
  };
  const leftArrowStyle: React.CSSProperties = { ...arrowButtonStyle, left: '20px' };
  const rightArrowStyle: React.CSSProperties = { ...arrowButtonStyle, right: '20px' };
  const dotsContainerStyle: React.CSSProperties = { 
    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', 
    display: 'flex', gap: '10px', zIndex: 4 
  };
  const dotStyle = (isActive: boolean): React.CSSProperties => ({ 
    width: '10px', height: '10px', borderRadius: '50%', 
    backgroundColor: isActive ? '#f97316' : 'rgba(255,255,255,0.5)', cursor: 'pointer' 
  });

  const sectionStyle: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 24px 24px' };
  const sectionHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' };
  const sectionTitleStyle: React.CSSProperties = { fontSize: '2rem', fontWeight: 'bold', color: '#000' };
  const seeMoreStyle: React.CSSProperties = { fontSize: '0.9rem', color: '#f97316', textDecoration: 'none', cursor: 'pointer', fontWeight: '500' };
  const placesGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' };
  
  const cardStyle: React.CSSProperties = { 
    backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s', 
    cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' 
  };
  const cardImageStyle: React.CSSProperties = { width: '100%', height: '200px', objectFit: 'cover' };
  const cardContentStyle: React.CSSProperties = { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' };
  const placeNameStyle: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' };
  const placeCategoryStyle: React.CSSProperties = { fontSize: '0.85rem', color: '#f97316', marginBottom: '4px' };
  const placeRatingStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '0.85rem', color: '#fbbf24' };

  const offersContainerStyle: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 24px 24px' };
  const offersTitleStyle: React.CSSProperties = { fontSize: '2rem', fontWeight: 'bold', color: '#000', textAlign: 'left', marginBottom: '24px' };
  const offersGridStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between' };
  const offerCardStyle: React.CSSProperties = { 
    flex: 1, minWidth: '200px', backgroundColor: 'white', borderRadius: '16px', 
    overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer' 
  };
  const offerImageStyle: React.CSSProperties = { width: '100%', height: '180px', objectFit: 'cover' };
  const offerContentStyle: React.CSSProperties = { padding: '16px' };
  const offerCardTitleStyle: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' };
  const offerDescStyle: React.CSSProperties = { fontSize: '0.9rem', color: '#6b7280' };
  const offers = [
    { image: '/image/08.jpg', title: 'Ưu đãi đặc biệt', desc: 'Giảm 30% cho đặt phòng đầu tiên' },
    { image: '/image/09.jpg', title: 'Tour hè 2025', desc: 'Combo tiết kiệm lên đến 1.000.000đ' },
    { image: '/image/10.jpg', title: 'Vé máy bay giá rẻ', desc: 'Bay khắp Đông Nam Á chỉ từ 99k' },
    { image: '/image/11.jpg', title: 'Khám phá văn hóa', desc: 'Trải nghiệm bản địa độc đáo' },
  ];

  const videoGridStyle: React.CSSProperties = { display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '8px', scrollbarWidth: 'thin' };
  const videoCardStyle: React.CSSProperties = { 
    flex: '0 0 auto', width: '320px', backgroundColor: 'white', borderRadius: '12px', 
    overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer' 
  };
  const videoThumbStyle: React.CSSProperties = { position: 'relative', width: '100%', height: '200px', backgroundColor: '#e5e7eb', overflow: 'hidden' };
  const videoImageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
  const playIconStyle: React.CSSProperties = { 
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '12px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center' 
  };
  const videos = Array(6).fill({ image: '/image/video1.jpg' });

  const dropdownContainerStyle: React.CSSProperties = { position: 'relative', display: 'inline-block' };
  const adminButtonStyle: React.CSSProperties = { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
    background: '#f97316', border: 'none', borderRadius: '9999px', color: '#fff', 
    cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 
  };
  const dropdownMenuStyle: React.CSSProperties = { 
    position: 'absolute', top: 'calc(100% + 8px)', right: 0, backgroundColor: 'white', 
    borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', 
    minWidth: '200px', zIndex: 1000, overflow: 'hidden', border: '1px solid #f0f0f0' 
  };
  const dropdownLinkStyle: React.CSSProperties = { 
    display: 'block', padding: '12px 20px', textDecoration: 'none', color: '#1f2937', 
    fontSize: '0.9rem', borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' 
  };
  const dropdownLogoutStyle: React.CSSProperties = { 
    display: 'block', width: '100%', textAlign: 'left', padding: '12px 20px', 
    background: 'none', border: 'none', color: '#ef4444', fontSize: '0.9rem', cursor: 'pointer' 
  };

  const benefits = [
    { icon: CheckCircle, title: 'Vô vàn lựa chọn', desc: 'Với hàng trăm ngàn điểm tham quan, khách sạn & nhiều hơn nữa, chắc chắn bạn sẽ tìm thấy niềm vui.' },
    { icon: ThumbsUp, title: 'Chơi vui, giá tốt', desc: 'Trải nghiệm chất lượng với giá tốt. Tích luỹ SkyTrip xu để được thêm ưu đãi.' },
    { icon: CreditCard, title: 'Dễ dàng và tiện lợi', desc: 'Đặt vé xác nhận ngay, miễn xếp hàng, miễn phí hủy, tiện lợi cho bạn tha hồ khám phá.' },
    { icon: Headphones, title: 'Đáng tin cậy', desc: 'Tham khảo đánh giá chân thực. Dịch vụ hỗ trợ tận tình, đồng hành cùng bạn mọi lúc, mọi nơi.' },
  ];

  const footerStyle: React.CSSProperties = { backgroundColor: '#1f2937', color: '#9ca3af', padding: '48px 24px 24px', marginTop: '48px' };
  const footerInnerStyle: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto' };
  const footerGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '48px' };
  const footerTitleStyle: React.CSSProperties = { color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' };
  const footerLinkStyle: React.CSSProperties = { display: 'block', color: '#9ca3af', textDecoration: 'none', marginBottom: '8px', fontSize: '0.9rem' };
  const copyrightStyle: React.CSSProperties = { textAlign: 'center', borderTop: '1px solid #374151', paddingTop: '24px', fontSize: '0.8rem' };

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
            <input type="text" placeholder="Bạn muốn đi đâu?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={inputStyle} />
            <button onClick={handleSearch} style={searchButtonStyle}>Tìm kiếm</button>
            {showSuggestions && searchSuggestions.length > 0 && (
              <div style={suggestionsStyle}>
                {searchSuggestions.map((place) => (
                  <div key={place._id} style={suggestionItemStyle} onClick={() => handleSuggestionClick(place.name)}>
                    <MapPin size={16} color="#f97316" />
                    <div><div style={{ fontWeight: 500 }}>{place.name}</div><div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{place.address}</div></div>
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

      {/* Ưu đãi */}
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

      {/* Địa điểm nổi bật */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Địa điểm nổi bật</h2>
          <Link href="/places" style={seeMoreStyle}>Xem thêm →</Link>
        </div>
        <div style={placesGridStyle}>
          {featuredPlaces.map((place) => (
            <Link href={`/places/${place._id}`} key={place._id} style={{ textDecoration: 'none' }}>
              <div style={cardStyle} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                <img src={place.image ? `${API_URL.replace('/api', '')}/uploads/${place.image}` : '/image/placeholder.jpg'} alt={place.name} style={cardImageStyle} />
                <div style={cardContentStyle}>
                  <div style={placeCategoryStyle}>{place.category}</div>
                  <div style={placeNameStyle}>{place.name}</div>
                  <div style={placeRatingStyle}>
                    {[...Array(5)].map((_, i) => (<Star key={i} size={14} fill={i < Math.floor(place.rating) ? '#fbbf24' : 'none'} color="#fbbf24" />))}
                    <span style={{ marginLeft: '4px', color: '#6b7280' }}>({place.rating || 0})</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bài viết mới */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Bài viết mới</h2>
          <Link href="/posts" style={seeMoreStyle}>Xem thêm →</Link>
        </div>
        <div style={placesGridStyle}>
          {recentPosts.map((post) => (
            <Link href={`/posts/${post._id}`} key={post._id} style={{ textDecoration: 'none' }}>
              <div style={cardStyle} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                {post.image && <img src={`${API_URL.replace('/api', '')}/uploads/${post.image}`} alt={post.title} style={cardImageStyle} />}
                <div style={cardContentStyle}>
                  <div style={placeNameStyle}>{post.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px', flex: 1 }}>{post.excerpt?.substring(0, 100)}...</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Đánh giá gần đây */}
      {recentReviews.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>Đánh giá gần đây</h2>
            <Link href="/reviews" style={seeMoreStyle}>Xem thêm →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {recentReviews.map((review) => (
              <div key={review._id} style={{ ...cardStyle, cursor: 'default' }}>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {review.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{review.user?.name || 'Người dùng'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#f97316' }}>
                        {[...Array(5)].map((_, i) => (<Star key={i} size={14} fill={i < review.rating ? '#f97316' : 'none'} color="#f97316" />))}
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#4b5563', lineHeight: 1.5, flex: 1 }}>{review.comment?.substring(0, 120)}...</p>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '12px' }}>
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')} - {review.place?.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Khám phá video */}
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

      {/* Phần "Vì sao bạn nên chọn SkyTrip" */}
      <div style={{ ...sectionStyle, paddingBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px', color: '#1f2937' }}>Vì sao bạn nên chọn SkyTrip</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
          {benefits.map((benefit, idx) => (
            <div key={idx} style={{ textAlign: 'center', padding: '24px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '32px', backgroundColor: '#f97316', marginBottom: '20px' }}>
                <benefit.icon size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>{benefit.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.5 }}>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerInnerStyle}>
          <div style={footerGridStyle}>
            <div>
              <h3 style={footerTitleStyle}>VỀ SKYTRIP</h3>
              <a href="#" style={footerLinkStyle}>Về chúng tôi</a>
              <a href="#" style={footerLinkStyle}>Cơ hội nghề nghiệp</a>
              <a href="#" style={footerLinkStyle}>Phiếu quà tặng SkyTrip</a>
              <a href="#" style={footerLinkStyle}>Du lịch bền vững</a>
            </div>
            <div>
              <h3 style={footerTitleStyle}>ĐỐI TÁC</h3>
              <a href="#" style={footerLinkStyle}>Đăng ký nhà cung cấp</a>
              <a href="#" style={footerLinkStyle}>Đối tác đăng nhập</a>
              <a href="#" style={footerLinkStyle}>Đối tác liên kết</a>
              <a href="#" style={footerLinkStyle}>Hợp tác với SkyTrip</a>
            </div>
            <div>
              <h3 style={footerTitleStyle}>ĐIỀU KHOẢN</h3>
              <a href="#" style={footerLinkStyle}>Điều khoản sử dụng</a>
              <a href="#" style={footerLinkStyle}>Chính sách bảo mật</a>
              <a href="#" style={footerLinkStyle}>Chính sách Cookie</a>
              <a href="#" style={footerLinkStyle}>Chính sách Phúc lợi động vật</a>
            </div>
            <div>
              <h3 style={footerTitleStyle}>KÊNH THANH TOÁN</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <img src="/image/visa.png" alt="Visa" style={{ height: '30px' }} />
                <img src="/image/mastercard.png" alt="Mastercard" style={{ height: '30px' }} />
                <img src="/image/momo.png" alt="MoMo" style={{ height: '30px' }} />
              </div>
            </div>
          </div>
          <div style={copyrightStyle}>
            © 2014-2026 SkyTrip. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}