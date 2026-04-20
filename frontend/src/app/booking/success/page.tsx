"use client";

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

// Component con chứa logic client
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', textAlign: 'center', maxWidth: '500px' }}>
        <CheckCircle size={64} color="#16a34a" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Thanh toán thành công!</h1>
        <p style={{ color: '#4b5563', marginBottom: '16px' }}>Cảm ơn bạn đã đặt chỗ. Đơn hàng của bạn đã được xác nhận.</p>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Chuyển hướng về trang chủ sau {countdown} giây...</p>
        <Link href="/" style={{ display: 'inline-block', marginTop: '20px', color: '#f97316', textDecoration: 'none' }}>Quay lại trang chủ ngay</Link>
      </div>
    </div>
  );
}

// Page chính bọc Suspense
export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>}>
      <SuccessContent />
    </Suspense>
  );
}