import axios from 'axios';

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((c) => {
  const t = localStorage.getItem('bf_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem('bf_token');
      localStorage.removeItem('bf_user');
      window.location.href = '/login';
    }
    return Promise.reject(e);
  }
);

export const authAPI = {
  register:      (d) => api.post('/auth/register', d),
  login:         (d) => api.post('/auth/login', d),
  me:            ()  => api.get('/auth/me'),
  updateProfile: (d) => api.put('/auth/me', d),
};

export const postAPI = {
  getAll: (p)     => api.get('/posts', { params: p }),
  getOne: (id)    => api.get(`/posts/${id}`),
  create: (d)     => api.post('/posts', d),
  update: (id, d) => api.put(`/posts/${id}`, d),
  delete: (id)    => api.delete(`/posts/${id}`),
  like:   (id)    => api.post(`/posts/${id}/like`),
};

export const commentAPI = {
  getAll: (pid)    => api.get(`/posts/${pid}/comments`),
  add:    (pid, d) => api.post(`/posts/${pid}/comments`, d),
  delete: (id)     => api.delete(`/comments/${id}`),
};

export default api;
