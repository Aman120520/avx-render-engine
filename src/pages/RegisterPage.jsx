import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/Auth/RegisterForm';
import '../styles/auth.css';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <RegisterForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}
