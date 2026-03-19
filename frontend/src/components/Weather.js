'use client';

export default function Weather({ location }) {
  return (
    <div>
      <h3>Thời tiết tại {location || 'khu vực'}</h3>
      <p>Nhiệt độ: 25°C (dữ liệu mẫu)</p>
    </div>
  );
}