import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const loginUser = async (email, password) => {
    const data = await authService.login(email, password);
    context.login(data.user_id, data.email, data.token);
    return data.user_id;
  };

  const registerUser = async (email, password) => {
    const data = await authService.register(email, password);
    context.login(data.user_id, data.email, data.token);
    return data.user_id;
  };

  return {
    token: context.token,
    user: context.user,
    loading: context.loading,
    login: loginUser,
    register: registerUser,
    logout: () => {
      authService.logout();
      context.logout();
    },
  };
}
