'use client';

export default function PlaceCard({ place }) {
  return (
    <div className="place-card">
      <h3>{place?.name || 'Địa điểm'}</h3>
      <p>{place?.description || 'Mô tả đang cập nhật'}</p>
    </div>
  );
}