import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';
import '../styles/auth.css';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <LoginForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}
