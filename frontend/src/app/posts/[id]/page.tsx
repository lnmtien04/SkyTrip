'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  createdAt: string;
  author: { name: string };
  views: number;
  category: { name: string };
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!params?.id) {
      setError('Không tìm thấy bài viết');
      setLoading(false);
      return;
    }
    fetchPost();
  }, [params?.id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${API_URL}/public/posts/${params.id}`);
      if (!res.ok) throw new Error('Không thể tải dữ liệu');
      const data = await res.json();
      setPost(data);
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
    return `${API_URL?.replace('/api', '')}/uploads/${image}`;
  };

  const containerStyle: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' };
  const backButtonStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f97316', color: 'white', padding: '10px 20px', borderRadius: '40px', border: 'none', cursor: 'pointer', marginBottom: '24px' };
  const titleStyle: React.CSSProperties = { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' };
  const metaStyle: React.CSSProperties = { display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' };
  const imageStyle: React.CSSProperties = { width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const contentStyle: React.CSSProperties = { fontSize: '1.1rem', lineHeight: 1.8, color: '#4b5563' };

  if (loading) return <div style={containerStyle}>Đang tải...</div>;
  if (error) return <div style={containerStyle}>Lỗi: {error}</div>;
  if (!post) return <div style={containerStyle}>Không tìm thấy bài viết</div>;

  return (
    <div style={containerStyle}>
      <button onClick={() => window.history.back()} style={backButtonStyle}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <h1 style={titleStyle}>{post.title}</h1>
      <div style={metaStyle}>
        <span><User size={16} /> {post.author?.name || 'Admin'}</span>
        <span><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
        <span><Eye size={16} /> {post.views || 0} lượt xem</span>
      </div>

      {post.image && <img src={getImageUrl(post.image)} alt={post.title} style={imageStyle} />}
      <div style={contentStyle} dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}