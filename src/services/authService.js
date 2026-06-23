import { apiCall } from '../utils/apiClient';

export const authService = {
  async register(email, password) {
    const response = await apiCall('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response;
  },

  async login(email, password) {
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_id', response.user_id);
    }
    return response;
  },

  async verify() {
    const response = await apiCall('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return response;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  }
};
