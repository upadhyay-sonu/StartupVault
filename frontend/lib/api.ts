import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  verifyEmail: (verificationToken: string) =>
    api.post('/auth/verify-email', { verificationToken }),

  getProfile: () => api.get('/auth/me'),

  updateProfile: (data: { name?: string; company?: string; role?: string }) =>
    api.put('/auth/profile', data),
};

export const dealsAPI = {
  getDeals: (filters?: {
    category?: string;
    search?: string;
    accessLevel?: string;
    limit?: number;
    skip?: number;
  }) => api.get('/deals', { params: filters }),

  getDealById: (id: string) => api.get(`/deals/${id}`),

  claimDeal: (dealId: string) => api.post(`/deals/${dealId}/claim`),
};

export const claimsAPI = {
  getClaims: (filters?: {
    status?: string;
    limit?: number;
    skip?: number;
  }) => api.get('/claims', { params: filters }),

  getClaimById: (id: string) => api.get(`/claims/${id}`),

  getStats: () => api.get('/claims/stats/overview'),
};

export default api;
