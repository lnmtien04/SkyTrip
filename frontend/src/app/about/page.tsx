// src/app/about/page.tsx
'use client';

import Link from 'next/link';
import { Users, MapPin, Heart, Award, Compass, Star, Globe, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
  // Styles
  const containerStyle: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' };
  const heroStyle: React.CSSProperties = { background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)', borderRadius: '24px', padding: '60px 32px', marginBottom: '48px', color: 'white', textAlign: 'center' };
  const heroTitleStyle: React.CSSProperties = { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' };
  const heroDescStyle: React.CSSProperties = { fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' };
  const sectionTitleStyle: React.CSSProperties = { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937', textAlign: 'center' };
  const statsGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '64px' };
  const statCardStyle: React.CSSProperties = { textAlign: 'center', padding: '24px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const statNumberStyle: React.CSSProperties = { fontSize: '2rem', fontWeight: 'bold', color: '#f97316', marginTop: '12px' };
  const statLabelStyle: React.CSSProperties = { fontSize: '1rem', color: '#6b7280', marginTop: '8px' };
  const missionStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '64px', alignItems: 'center' };
  const missionTextStyle: React.CSSProperties = { flex: 1, minWidth: '280px' };
  const missionImageStyle: React.CSSProperties = { flex: 1, minWidth: '280px', backgroundColor: '#f3f4f6', borderRadius: '16px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' };
  const teamGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '32px', marginBottom: '64px' };
  const teamCardStyle: React.CSSProperties = { textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const avatarStyle: React.CSSProperties = { width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f97316', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem' };
  const teamNameStyle: React.CSSProperties = { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' };
  const teamRoleStyle: React.CSSProperties = { fontSize: '0.9rem', color: '#f97316', marginBottom: '12px' };
  const valueGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '64px' };
  const valueCardStyle: React.CSSProperties = { textAlign: 'center', padding: '24px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const contactGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '64px' };
  const contactCardStyle: React.CSSProperties = { textAlign: 'center', padding: '24px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const ctaStyle: React.CSSProperties = { backgroundColor: '#f97316', borderRadius: '24px', padding: '48px 32px', textAlign: 'center', color: 'white' };
  const ctaTitleStyle: React.CSSProperties = { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '16px' };
  const ctaButtonStyle: React.CSSProperties = { display: 'inline-block', backgroundColor: 'white', color: '#f97316', padding: '12px 32px', borderRadius: '40px', textDecoration: 'none', fontWeight: 'bold', marginTop: '24px' };

  const stats = [
    { icon: Users, number: '10,000+', label: 'Khách hàng hài lòng' },
    { icon: MapPin, number: '500+', label: 'Điểm đến' },
    { icon: Heart, number: '98%', label: 'Đánh giá tích cực' },
    { icon: Award, number: '5 năm', label: 'Kinh nghiệm' },
  ];

  const team = [
    { name: 'Nguyễn Văn A', role: 'CEO & Founder', avatar: 'A' },
    { name: 'Trần Thị B', role: 'Giám đốc điều hành', avatar: 'B' },
    { name: 'Lê Văn C', role: 'Trưởng phòng Marketing', avatar: 'C' },
    { name: 'Phạm Thị D', role: 'Chuyên gia du lịch', avatar: 'D' },
  ];

  const values = [
    { icon: Compass, title: 'Khám phá', desc: 'Luôn tìm kiếm những trải nghiệm mới mẻ' },
    { icon: Heart, title: 'Chân thành', desc: 'Phục vụ khách hàng bằng cả trái tim' },
    { icon: Star, title: 'Chất lượng', desc: 'Cam kết dịch vụ tốt nhất' },
  ];

  const contacts = [
    { icon: MapPin, title: 'Địa chỉ', info: '123 Đường Láng, Hà Nội, Việt Nam' },
    { icon: Phone, title: 'Điện thoại', info: '1900 1234' },
    { icon: Mail, title: 'Email', info: 'hello@skytrip.com' },
    { icon: Globe, title: 'Website', info: 'www.skytrip.com' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Hero */}
      <div style={heroStyle}>
        <div style={heroTitleStyle}>Về chúng tôi</div>
        <div style={heroDescStyle}>SkyTrip – Đưa bạn đến những miền đất mới</div>
      </div>

      <div style={containerStyle}>
        {/* Số liệu thống kê */}
        <div style={statsGridStyle}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} style={statCardStyle}>
                <Icon size={40} color="#f97316" />
                <div style={statNumberStyle}>{stat.number}</div>
                <div style={statLabelStyle}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Sứ mệnh */}
        <div style={missionStyle}>
          <div style={missionTextStyle}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '16px' }}>Sứ mệnh của chúng tôi</h2>
            <p style={{ lineHeight: 1.6, color: '#4b5563', marginBottom: '16px' }}>
              SkyTrip ra đời với mong muốn mang đến những trải nghiệm du lịch đáng nhớ nhất cho mọi người.
              Chúng tôi tin rằng mỗi chuyến đi không chỉ là đến một nơi nào đó, mà còn là khám phá văn hóa,
              kết nối con người và tìm kiếm những khoảnh khắc đáng sống.
            </p>
            <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
              Với đội ngũ giàu kinh nghiệm và đam mê, chúng tôi cam kết đồng hành cùng bạn trên mọi nẻo đường,
              từ những bãi biển xanh mát đến những đỉnh núi hùng vĩ.
            </p>
          </div>
          <div style={missionImageStyle}>
            <Compass size={80} color="#9ca3af" />
          </div>
        </div>

        {/* Giá trị cốt lõi */}
        <h2 style={sectionTitleStyle}>Giá trị cốt lõi</h2>
        <div style={valueGridStyle}>
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} style={valueCardStyle}>
                <Icon size={48} color="#f97316" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px' }}>{val.title}</h3>
                <p style={{ color: '#6b7280' }}>{val.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Đội ngũ */}
        <h2 style={sectionTitleStyle}>Đội ngũ của chúng tôi</h2>
        <div style={teamGridStyle}>
          {team.map((member, idx) => (
            <div key={idx} style={teamCardStyle}>
              <div style={avatarStyle}>{member.avatar}</div>
              <div style={teamNameStyle}>{member.name}</div>
              <div style={teamRoleStyle}>{member.role}</div>
            </div>
          ))}
        </div>

        {/* Thông tin liên hệ */}
        <h2 style={sectionTitleStyle}>Thông tin liên hệ</h2>
        <div style={contactGridStyle}>
          {contacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <div key={idx} style={contactCardStyle}>
                <Icon size={40} color="#f97316" />
                <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '12px', marginBottom: '8px' }}>{contact.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{contact.info}</div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div style={ctaStyle}>
          <div style={ctaTitleStyle}>Bắt đầu hành trình của bạn</div>
          <p style={{ marginBottom: '16px' }}>Hàng ngàn điểm đến đang chờ bạn khám phá</p>
          <Link href="/places" style={ctaButtonStyle}>Khám phá ngay</Link>
        </div>
      </div>
    </div>
  );
}