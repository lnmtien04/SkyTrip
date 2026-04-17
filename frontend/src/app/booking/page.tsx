'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Calendar, Users, MapPin, CreditCard, Info } from 'lucide-react';

interface Place {
  _id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  availableDates: string[];
  pickupPoints: string[];
  duration: number; // số ngày của tour
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const placeId = searchParams.get('placeId');
  
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pickupPoint, setPickupPoint] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerIdNumber, setCustomerIdNumber] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('later');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Tính ngày kết thúc
  const endDate = useMemo(() => {
    if (!departureDate || !place?.duration) return null;
    const start = new Date(departureDate);
    const end = new Date(start);
    end.setDate(end.getDate() + (place.duration - 1));
    return end;
  }, [departureDate, place]);

  // Lấy thông tin user nếu đã login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, name: payload.name, email: payload.email });
        setCustomerName(payload.name || '');
        setCustomerEmail(payload.email || '');
      } catch (e) { console.error(e); }
    }
  }, []);

  // Lấy thông tin tour
  useEffect(() => {
    if (!placeId) {
      router.push('/');
      return;
    }
    fetchPlace();
  }, [placeId]);

  const fetchPlace = async () => {
    try {
      const res = await fetch(`${API_URL}/public/places/${placeId}`);
      if (!res.ok) throw new Error('Không tìm thấy tour');
      const data = await res.json();
      setPlace(data);
      if (data.pickupPoints && data.pickupPoints.length > 0) {
        setPickupPoint(data.pickupPoints[0]);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải thông tin tour' });
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng tiền realtime
  const totalPrice = useMemo(() => {
    if (!place) return 0;
    return (place.priceAdult * adults) + (place.priceChild * children) + (place.priceInfant * infants);
  }, [place, adults, children, infants]);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' ₫';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập họ tên người đại diện' });
      return;
    }
    if (!customerPhone.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập số điện thoại' });
      return;
    }
    if (!departureDate) {
      setMessage({ type: 'error', text: 'Vui lòng chọn ngày khởi hành' });
      return;
    }
    if (adults + children + infants === 0) {
      setMessage({ type: 'error', text: 'Vui lòng chọn ít nhất 1 khách' });
      return;
    }
    
    setSubmitting(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        place: placeId,
        departureDate,
        adults,
        children,
        infants,
        pickupPoint,
        specialRequests,
        customerName,
        customerPhone,
        customerEmail,
        customerIdNumber,
        totalPrice,
      };
      
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đặt tour thất bại');
      
      if (paymentMethod === 'later') {
        setMessage({ type: 'success', text: 'Đặt tour thành công! Vui lòng chờ admin xác nhận và hướng dẫn thanh toán.' });
        setTimeout(() => router.push('/'), 3000);
      } else {
        const paymentRes = await fetch(`${API_URL}/payment/create-payment`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: data._id, amount: totalPrice, orderInfo: `Thanh toan tour ${place?.name} - ${departureDate}` }),
        });
        const { paymentUrl } = await paymentRes.json();
        if (paymentUrl) window.location.href = paymentUrl;
        else throw new Error('Không tạo được URL thanh toán');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const availableDates = place?.availableDates || [];
  const minDate = new Date().toISOString().split('T')[0];

  // Styles (giữ nguyên)
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px', margin: '0 auto', padding: '32px 24px',
  };
  const backButtonStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    backgroundColor: '#f97316', color: 'white', padding: '10px 20px',
    borderRadius: '40px', border: 'none', cursor: 'pointer', marginBottom: '24px',
  };
  const gridStyle: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px',
  };
  const formCardStyle: React.CSSProperties = {
    backgroundColor: 'white', borderRadius: '24px', padding: '28px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };
  const summaryCardStyle: React.CSSProperties = {
    backgroundColor: '#fff7ed', borderRadius: '24px', padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', alignSelf: 'start', position: 'sticky', top: '100px',
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.3rem', fontWeight: '600', marginBottom: '20px',
    borderBottom: '2px solid #f97316', display: 'inline-block', paddingBottom: '4px',
  };
  const formRowStyle: React.CSSProperties = { marginBottom: '20px' };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
    borderRadius: '12px', fontSize: '1rem', boxSizing: 'border-box',
  };
  const selectStyle = { ...inputStyle, backgroundColor: 'white' };
  const radioGroupStyle: React.CSSProperties = {
    display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px',
  };
  const radioLabelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
  };
  const submitButtonStyle: React.CSSProperties = {
    backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '40px',
    padding: '14px 24px', fontWeight: 'bold', cursor: 'pointer', width: '100%',
    marginTop: '24px', fontSize: '1rem',
  };
  const messageStyle = (type: string): React.CSSProperties => ({
    padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center',
    backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2',
    color: type === 'success' ? '#16a34a' : '#dc2626',
  });

  if (loading) return <div style={containerStyle}>Đang tải thông tin tour...</div>;
  if (!place) return <div style={containerStyle}>Không tìm thấy tour</div>;

  return (
    <div style={containerStyle}>
      <button onClick={() => router.back()} style={backButtonStyle}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div style={gridStyle}>
        {/* Form bên trái */}
        <div style={formCardStyle}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
            Đặt tour {place.name}
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{place.address}</p>

          {message && <div style={messageStyle(message.type)}>{message.text}</div>}

          <form onSubmit={handleSubmit}>
            {/* Thông tin tour (readonly) */}
            <div style={sectionTitleStyle}>Thông tin tour</div>
            <div style={{ ...formRowStyle, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...inputStyle, backgroundColor: '#f9fafb' }}>{place.name}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...inputStyle, backgroundColor: '#f9fafb' }}>
                  Giá: {formatPrice(place.priceAdult || 0)} / người lớn
                </div>
              </div>
            </div>

            {/* Ngày khởi hành */}
            <div style={sectionTitleStyle}>Ngày khởi hành</div>
            <div style={formRowStyle}>
              <label style={labelStyle}>Chọn ngày khởi hành *</label>
              <select
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                style={selectStyle}
                required
              >
                <option value="">-- Chọn ngày --</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>{new Date(date).toLocaleDateString('vi-VN')}</option>
                ))}
              </select>
            </div>

            {/* Hiển thị ngày kết thúc (readonly) */}
            {departureDate && place.duration && (
              <div style={formRowStyle}>
                <label style={labelStyle}>Ngày kết thúc</label>
                <div style={{ ...inputStyle, backgroundColor: '#f9fafb' }}>
                  {endDate ? endDate.toLocaleDateString('vi-VN') : '--'}
                </div>
              </div>
            )}

            {/* Số lượng khách */}
            <div style={sectionTitleStyle}>Số lượng khách</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Người lớn (≥12 tuổi)</label>
                <input type="number" min="0" max="20" value={adults} onChange={(e) => setAdults(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Trẻ em (6-11 tuổi)</label>
                <input type="number" min="0" max="20" value={children} onChange={(e) => setChildren(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Em bé (&lt;6 tuổi)</label>
                <input type="number" min="0" max="20" value={infants} onChange={(e) => setInfants(Number(e.target.value))} style={inputStyle} />
              </div>
            </div>

            {/* Điểm đón */}
            <div style={sectionTitleStyle}>Điểm đón</div>
            <div style={formRowStyle}>
              <label style={labelStyle}>Chọn điểm đón *</label>
              <select value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)} style={selectStyle} required>
                {place.pickupPoints?.map((point) => (
                  <option key={point} value={point}>{point}</option>
                ))}
              </select>
            </div>

            {/* Thông tin khách hàng */}
            <div style={sectionTitleStyle}>Thông tin người đại diện</div>
            <div style={formRowStyle}>
              <label style={labelStyle}>Họ tên *</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={inputStyle} required />
            </div>
            <div style={formRowStyle}>
              <label style={labelStyle}>Số điện thoại *</label>
              <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={inputStyle} required />
            </div>
            <div style={formRowStyle}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={formRowStyle}>
              <label style={labelStyle}>CCCD/Passport (nếu có)</label>
              <input type="text" value={customerIdNumber} onChange={(e) => setCustomerIdNumber(e.target.value)} style={inputStyle} />
            </div>

            {/* Ghi chú */}
            <div style={sectionTitleStyle}>Yêu cầu đặc biệt</div>
            <div style={formRowStyle}>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                placeholder="Ví dụ: ăn chay, dị ứng, yêu cầu riêng..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Phương thức thanh toán */}
            <div style={sectionTitleStyle}>Phương thức thanh toán</div>
            <div style={radioGroupStyle}>
              <label style={radioLabelStyle}>
                <input type="radio" name="paymentMethod" value="later" checked={paymentMethod === 'later'} onChange={() => setPaymentMethod('later')} />
                Thanh toán sau (giữ chỗ)
              </label>
              <label style={radioLabelStyle}>
                <input type="radio" name="paymentMethod" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
                Thanh toán ngay qua VNPay
              </label>
            </div>

            <button type="submit" disabled={submitting} style={submitButtonStyle}>
              {submitting ? 'Đang xử lý...' : 'Xác nhận đặt tour'}
            </button>
          </form>
        </div>

        {/* Sidebar summary */}
        <div style={summaryCardStyle}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>Chi tiết thanh toán</h3>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>{place.name}</strong></p>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Ngày khởi hành: {departureDate ? new Date(departureDate).toLocaleDateString('vi-VN') : 'Chưa chọn'}</p>
            {endDate && (
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Ngày kết thúc: {endDate.toLocaleDateString('vi-VN')}</p>
            )}
          </div>
          <div style={{ borderTop: '1px solid #fed7aa', paddingTop: '12px', marginBottom: '12px' }}>
            {adults > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Người lớn x {adults}</span>
                <span>{formatPrice((place.priceAdult || 0) * adults)}</span>
              </div>
            )}
            {children > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Trẻ em x {children}</span>
                <span>{formatPrice((place.priceChild || 0) * children)}</span>
              </div>
            )}
            {infants > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Em bé x {infants}</span>
                <span>{formatPrice((place.priceInfant || 0) * infants)}</span>
              </div>
            )}
          </div>
          <div style={{ borderTop: '2px solid #f97316', paddingTop: '12px', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Tổng tiền</span>
              <span style={{ color: '#f97316' }}>{formatPrice(totalPrice)}</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '8px' }}>
              * Giá đã bao gồm thuế và phí
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}