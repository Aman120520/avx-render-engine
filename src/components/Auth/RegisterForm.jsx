import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return 'weak';
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const length = password.length >= 8;

    const strength = [hasUpper, hasLower, hasDigit, length].filter(Boolean).length;
    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();
  const isFormValid =
    email &&
    password &&
    password === confirmPassword &&
    password.length >= 8 &&
    strength === 'strong';

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 8 chars, uppercase, lowercase, digit"
          required
        />
        <div className={`password-strength ${strength}`}>
          Strength: {strength}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          required
        />
      </div>

      <button type="submit" disabled={!isFormValid || loading} className="btn-primary">
        {loading ? 'Creating account...' : 'Register'}
      </button>

      <p className="form-footer">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </form>
  );
}
