'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    // Bỏ validation email client-side, để backend xử lý
    // (backend sẽ kiểm tra email hoặc username)
    const result = await login(email, password);
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Đăng nhập thất bại');
    }
  };

  // Styles
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 50%, #e0f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: '448px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '40px 32px',
    boxSizing: 'border-box',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '30px',
    fontWeight: 'bold',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#4b5563', // đậm hơn
    fontSize: '14px',
    marginBottom: '32px',
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '24px',
  };

  const fieldStyle: React.CSSProperties = { marginBottom: '20px' };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  };
  const inputWrapperStyle: React.CSSProperties = { position: 'relative' };
  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    width: '18px',
    height: '18px',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  };
  const passwordToggleStyle: React.CSSProperties = {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: 0,
  };
  const buttonStyle: React.CSSProperties = {
    width: '100%',
    background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    color: 'white',
    fontWeight: 'bold',
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };
  const forgotPasswordStyle: React.CSSProperties = {
    textAlign: 'right',
    marginTop: '-12px',
    marginBottom: '20px',
  };
  const forgotLinkStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    textDecoration: 'none',
  };
  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '24px',
  };
  const linkStyle: React.CSSProperties = {
    color: '#2563eb',
    fontWeight: '500',
    textDecoration: 'none',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>Đăng nhập</div>
        <div style={subtitleStyle}>Chào mừng trở lại SkyTrip</div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email hoặc tên đăng nhập</label>
            <div style={inputWrapperStyle}>
              <Mail style={iconStyle} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com hoặc tên đăng nhập"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Mật khẩu</label>
            <div style={inputWrapperStyle}>
              <Lock style={iconStyle} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={forgotPasswordStyle}>
            <Link href="/forgot-password" style={forgotLinkStyle}>
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" style={buttonStyle}>
            Đăng nhập
          </button>
        </form>

        <div style={footerStyle}>
          Chưa có tài khoản?{' '}
          <Link href="/register" style={linkStyle}>
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}