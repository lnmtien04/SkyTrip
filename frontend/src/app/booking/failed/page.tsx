'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function BookingFailedPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', textAlign: 'center', maxWidth: '500px' }}>
        <XCircle size={64} color="#dc2626" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Thanh toán thất bại</h1>
        <p style={{ color: '#4b5563', marginBottom: '16px' }}>Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.</p>
        <Link href="/" style={{ display: 'inline-block', marginTop: '20px', color: '#f97316', textDecoration: 'none' }}>Quay lại trang chủ</Link>
      </div>
    </div>
  );
}