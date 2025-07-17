// src/LoginPage.js
import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { setToken } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const startRef = useRef(Date.now());
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    const time_to_submit = (Date.now() - startRef.current) / 1000;

    const body = {
      username,
      password,
      uri: '/login',
      client_ip: '203.0.113.5',
      timestamp: Math.floor(Date.now() / 1000),
      time_to_submit
    };

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { detail: text }; }

      if (res.status === 403) {
        return window.alert(data.detail || 'Bot detected! Access denied.');
      }
      if (!res.ok) {
        return setError(data.detail || 'Login failed.');
      }

      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      localStorage.setItem('username', username);
      localStorage.setItem('account', data.account);
      localStorage.setItem('balance', data.balance);

      navigate('/dashboard');
    } catch {
      setError('Network error — please try again.');
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-field">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <label>Enter your email</label>
        </div>

        <div className="input-field">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <label>Enter your password</label>
        </div>

        <div className="forget">
          <label htmlFor="remember">
            <input type="checkbox" id="remember" />
            <p>Remember me</p>
          </label>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button type="submit">Log In</button>
        {error && <p className="attack">{error}</p>}

        <div className="register">
          <p>
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}
