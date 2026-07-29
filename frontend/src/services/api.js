import axios from 'axios';

let store;
export const injectStore = (_store) => {
  store = _store;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor - attach JWT token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = await import('../store/authSlice');
        await store.dispatch(refreshToken()).unwrap();
        const newToken = sessionStorage.getItem('token');
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        const { logout } = await import('../store/authSlice');
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (token) => api.post('/auth/refresh', { refreshToken: token }),
  logout: () => api.post('/auth/logout'),
};

// ═══════════════════════════════════════
// USER API
// ═══════════════════════════════════════
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getStats: () => api.get('/user/stats'),
  getBadges: () => api.get('/user/badges'),
};

// ═══════════════════════════════════════
// QUESTIONS API
// ═══════════════════════════════════════
export const questionAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  addBookmark: (questionId) => api.post('/questions/bookmark', { questionId }),
  removeBookmark: (questionId) => api.delete(`/questions/bookmark/${questionId}`),
  generate: (params) => api.post('/questions/generate', params),
};

// ═══════════════════════════════════════
// SESSIONS API
// ═══════════════════════════════════════
export const sessionAPI = {
  start: (config) => api.post('/sessions/start', config),
  submitAnswer: (id, data) => api.post(`/sessions/${id}/submit-answer`, data),
  complete: (id) => api.post(`/sessions/${id}/complete`),
  getHistory: () => api.get('/sessions/history'),
  getResults: (id) => api.get(`/sessions/${id}/results`),
};

// ═══════════════════════════════════════
// ROLEPLAY API
// ═══════════════════════════════════════
export const roleplayAPI = {
  start: (config) => api.post('/roleplay/start', config),
  sendMessage: (id, message) => api.post(`/roleplay/${id}/message`, { message }),
  complete: (id) => api.post(`/roleplay/${id}/complete`),
  getHistory: () => api.get('/roleplay/history'),
  getResults: (id) => api.get(`/roleplay/${id}/results`),
};

// ═══════════════════════════════════════
// ANALYTICS API
// ═══════════════════════════════════════
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getTrends: (params) => api.get('/analytics/trends', { params }),
  getCategoryBreakdown: () => api.get('/analytics/category-breakdown'),
};

// ═══════════════════════════════════════
// LEADERBOARD API
// ═══════════════════════════════════════
export const leaderboardAPI = {
  getWeekly: () => api.get('/leaderboard/weekly'),
  getMonthly: () => api.get('/leaderboard/monthly'),
  getAllTime: () => api.get('/leaderboard/all-time'),
};

// ═══════════════════════════════════════
// RESUME API
// ═══════════════════════════════════════
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  generateQuestions: (data) => api.post('/resume/generate-questions', data),
};

// ═══════════════════════════════════════
// COMPANY API
// ═══════════════════════════════════════
export const companyAPI = {
  getList: () => api.get('/company/list'),
  getQuestions: (id) => api.get(`/company/${id}/questions`),
  getRounds: (id) => api.get(`/company/${id}/rounds`),
};

// ═══════════════════════════════════════
// ACHIEVEMENTS API
// ═══════════════════════════════════════
export const achievementAPI = {
  getAll: () => api.get('/achievements/all'),
  getUserAchievements: () => api.get('/achievements/user'),
};

// ═══════════════════════════════════════
// FOCUS PLAN API
// ═══════════════════════════════════════
export const focusPlanAPI = {
  getLatest: () => api.get('/focus-plan/latest'),
  generate: () => api.post('/focus-plan/generate'),
};

// ═══════════════════════════════════════
// PEER API
// ═══════════════════════════════════════
export const peerAPI = {
  joinQueue: () => api.post('/peer/join-queue'),
  leaveQueue: () => api.delete('/peer/leave-queue'),
  getSession: (id) => api.get(`/peer/session/${id}`),
};

export default api;
