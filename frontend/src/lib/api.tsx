// src/lib/api.ts

// ==================== Types ====================
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}

export interface Place {
  _id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  image: string;
  lat: number;
  lng: number;
  rating: number;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: User;
  place: Place;
  rating: number;
  comment: string;
  createdAt: string;
}

// ==================== Helpers ====================
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const authHeader = (): HeadersInit => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ==================== AUTH ====================
export async function register(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function login(credentials: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function getCurrentUser(): Promise<{ user: User }> {
  const res = await fetch(`/api/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
  return data;
}

export async function updateProfile(userData: Partial<User>): Promise<{ user: User }> {
  const res = await fetch(`/api/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data;
}

export async function changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<MessageResponse> {
  const res = await fetch(`/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(passwordData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Change password failed');
  return data;
}

// ==================== ADMIN ====================
export async function getAllUsers(): Promise<{ users: User[] }> {
  const res = await fetch(`/api/admin/users`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
  return data;
}

export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<{ user: User }> {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({ role })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update role');
  return data;
}

export async function toggleUserActive(userId: string): Promise<{ user: User }> {
  const res = await fetch(`/api/admin/users/${userId}/toggle-active`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to toggle user active');
  return data;
}

// ==================== PLACES ====================
export async function getPlaces(params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<{ places: Place[]; total: number; page: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.category) query.append('category', params.category);
  const res = await fetch(`/api/places?${query}`);
  if (!res.ok) throw new Error('Failed to fetch places');
  return res.json();
}

export async function getPlaceById(id: string): Promise<Place> {
  const res = await fetch(`/api/places/${id}`);
  if (!res.ok) throw new Error('Failed to fetch place');
  return res.json();
}

export const addFavorite = async (placeId: string): Promise<{ message: string }> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`/api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ placeId })
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return res.json();
};

export const removeFavorite = async (placeId: string): Promise<{ message: string }> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`/api/favorites/${placeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
  return res.json();
};

// ==================== REVIEWS ====================
export async function getRecentReviews(limit: number = 3): Promise<Review[]> {
  try {
    const res = await fetch(`/api/reviews/recent?limit=${limit}`);
    if (!res.ok) {
      console.warn('API /reviews/recent chưa sẵn sàng, trả về mảng rỗng');
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching recent reviews:', error);
    return [];
  }
}