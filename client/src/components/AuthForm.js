import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ onSubmit, isLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!isLogin && !formData.name) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await onSubmit(formData);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="error">{error}</div>}

      {!isLogin && (
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="input"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="input"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />
      </div>

      {!isLogin && (
        <div className="form-group">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            className="input"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading}
      >
        {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;



