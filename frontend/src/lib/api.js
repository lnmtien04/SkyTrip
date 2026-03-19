// Các hàm gọi API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getPlaces() {
  const res = await fetch(`${API_URL}/api/places`);
  if (!res.ok) throw new Error('Failed to fetch places');
  return res.json();
}

export async function getPlaceById(id) {
  const res = await fetch(`${API_URL}/api/places/${id}`);
  if (!res.ok) throw new Error('Failed to fetch place');
  return res.json();
}

// Thêm các hàm khác nếu cần