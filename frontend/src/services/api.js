import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
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

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authService = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/auth/profile'),
};

// Alerts
export const alertService = {
  createAlert: (type, target, condition, notificationMethod) =>
    api.post('/alerts', { type, target, condition, notificationMethod }),
  getAlerts: () =>
    api.get('/alerts'),
  updateAlert: (id, data) =>
    api.put(`/alerts/${id}`, data),
  deleteAlert: (id) =>
    api.delete(`/alerts/${id}`),
};

// News
export const newsService = {
  getMarketNews: (limit = 50) =>
    api.get('/news/market', { params: { limit } }),
  getEconomicCalendar: () =>
    api.get('/news/economic-calendar'),
  getPoliticalEvents: () =>
    api.get('/news/events'),
  getStockPrice: (symbol) =>
    api.get(`/news/prices/${symbol}`),
  getNewsBySource: (source, limit = 20) =>
    api.get(`/news/source/${source}`, { params: { limit } }),
  getNewsBySentiment: (sentiment, limit = 30) =>
    api.get(`/news/sentiment/${sentiment}`, { params: { limit } }),
};

// Payments
export const paymentService = {
  createCheckoutSession: (plan, email) =>
    api.post('/payment/create-checkout-session', { plan, email }),
  getSubscriptionStatus: (email) =>
    api.get(`/payment/status/${email}`),
};

export default api;
