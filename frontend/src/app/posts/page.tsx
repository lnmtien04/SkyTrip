'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, User, Eye } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string;
  author: { name: string };
  views: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchPosts();
  }, [currentPage, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        ...(search && { search }),
      });
      const res = await fetch(`${API_URL}/public/posts?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: string) => {
    if (!image) return '/image/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return `${API_URL?.replace('/api', '')}/uploads/${image}`;
  };

  // Styles (inline, đồng bộ với trang địa điểm)
  const containerStyle: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' };
  const heroStyle: React.CSSProperties = { background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)', borderRadius: '24px', padding: '40px 32px', marginBottom: '40px', color: 'white', textAlign: 'center' };
  const heroTitleStyle: React.CSSProperties = { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' };
  const heroDescStyle: React.CSSProperties = { fontSize: '1.1rem', opacity: 0.9, marginBottom: '24px' };
  const searchContainerStyle: React.CSSProperties = { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' };
  const inputStyle: React.CSSProperties = { flex: 1, minWidth: '250px', padding: '14px 20px', borderRadius: '50px', border: 'none', outline: 'none', fontSize: '1rem', color: '#1f2937' };
  const searchButtonStyle: React.CSSProperties = { backgroundColor: 'white', color: '#f97316', padding: '14px 28px', borderRadius: '50px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' };
  const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' };
  const cardStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer' };
  const imageStyle: React.CSSProperties = { width: '100%', height: '200px', objectFit: 'cover' };
  const cardContentStyle: React.CSSProperties = { padding: '20px' };
  const titleStyle: React.CSSProperties = { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' };
  const excerptStyle: React.CSSProperties = { fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '12px' };
  const metaStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af', borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '8px' };
  const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' };
  const pageBtnStyle = (disabled: boolean): React.CSSProperties => ({ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'white', color: disabled ? '#9ca3af' : '#374151', border: '1px solid #e2e8f0', cursor: disabled ? 'not-allowed' : 'pointer' });

  if (loading) return <div style={containerStyle}>Đang tải...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={heroStyle}>
        <div style={heroTitleStyle}>Blog du lịch</div>
        <div style={heroDescStyle}>Cẩm nang, kinh nghiệm và những câu chuyện du lịch</div>
        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
          <button onClick={() => setCurrentPage(1)} style={searchButtonStyle}>
            <Search size={18} /> Tìm kiếm
          </button>
        </div>
      </div>

      <div style={containerStyle}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Chưa có bài viết nào</div>
        ) : (
          <>
            <div style={gridStyle}>
              {posts.map((post) => (
                <Link href={`/posts/${post._id}`} key={post._id} style={{ textDecoration: 'none' }}>
                  <div
                    style={cardStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <img src={getImageUrl(post.image)} alt={post.title} style={imageStyle} />
                    <div style={cardContentStyle}>
                      <div style={titleStyle}>{post.title}</div>
                      <div style={excerptStyle}>{post.excerpt?.substring(0, 100)}...</div>
                      <div style={metaStyle}>
                        <span><User size={14} /> {post.author?.name || 'Admin'}</span>
                        <span><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span><Eye size={14} /> {post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} style={pageBtnStyle(currentPage === 1)}>Trước</button>
                <span>Trang {currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} style={pageBtnStyle(currentPage === totalPages)}>Sau</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}