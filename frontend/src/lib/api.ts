import { User, Car, Lead, DashboardStats, AuthResponse, CarListResponse, LoginPayload, RegisterPayload } from '@/types';

// The base URL for the backend server
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4404';
// The URL for API requests
const API_URL = `${BASE_URL}/api`;

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { ...((options.headers as Record<string, string>) || {}) };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  auth: {
    register: (data: RegisterPayload): Promise<{ message: string }> => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: LoginPayload): Promise<AuthResponse> => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    verifyOtp: (email: string, otp: string): Promise<AuthResponse> => fetchApi('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
    profile: (): Promise<User> => fetchApi('/auth/profile'),
    updateProfile: (data: Partial<User>): Promise<User> => fetchApi('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  cars: {
    list: (params?: Record<string, string>): Promise<CarListResponse> => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi<CarListResponse>(`/cars${query}`);
    },
    get: (id: string): Promise<Car> => fetchApi<Car>(`/cars/${id}`),
    create: (formData: FormData): Promise<Car> => fetchApi<Car>('/cars', { method: 'POST', body: formData }),
    update: (id: string, data: Partial<Car>): Promise<Car> => fetchApi<Car>(`/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string): Promise<{ message: string }> => fetchApi(`/cars/${id}`, { method: 'DELETE' }),
    similar: (id: string): Promise<Car[]> => fetchApi<Car[]>(`/cars/${id}/similar`),
    favorite: (id: string): Promise<{ favorited: boolean }> => fetchApi(`/cars/${id}/favorite`, { method: 'POST' }),
    favorites: (): Promise<Car[]> => fetchApi<Car[]>('/cars/user/favorites'),
    myListings: (params?: Record<string, string>): Promise<CarListResponse> => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi<CarListResponse>(`/cars/user/listings${query}`);
    },
    dashboard: (): Promise<DashboardStats> => fetchApi<DashboardStats>('/cars/user/dashboard'),
    makes: (): Promise<string[]> => fetchApi<string[]>('/cars/makes'),
    models: (make: string): Promise<string[]> => fetchApi<string[]>(`/cars/makes/${make}/models`),
    addImages: (id: string, formData: FormData): Promise<Car> => fetchApi<Car>(`/cars/${id}/images`, { method: 'POST', body: formData }),
  },
  leads: {
    create: (data: Partial<Lead>): Promise<Lead> => fetchApi<Lead>('/leads', { method: 'POST', body: JSON.stringify(data) }),
    my: (): Promise<{ leads: Lead[], total: number }> => fetchApi('/leads/my'),
    updateStatus: (id: string, status: string): Promise<Lead> => fetchApi<Lead>(`/leads/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },
};

export const getImageUrl = (path: string) => {
  if (!path) return '/images/sedan.png';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};
