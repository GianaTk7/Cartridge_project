import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create form data for the backend
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch(`${BACKEND_URL}/api/Login/login`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Store authentication data
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('adminUsername', data.Login.username);
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminRole', data.Login.role);
        sessionStorage.setItem('adminId', data.Login.id);
        
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter your username or email"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>❌</span>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button type="button" className="home-btn" onClick={handleGoHome}>
           Back to Home
          </button>
        </form>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        .login-container {
          background: white;
          border-radius: 20px;
          padding: 3rem 2.5rem;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .login-header h1 {
          font-size: 1.8rem;
          color: #333;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .login-header p {
          color: #888;
          font-size: 0.95rem;
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          font-size: 1.1rem;
          color: #999;
          pointer-events: none;
        }

        .form-group input {
          width: 100%;
          padding: 0.9rem 0.9rem 0.9rem 3rem;
          border: 2px solid #e8e8e8;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fafafa;
          color: #333;
          outline: none;
        }

        .form-group input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-group input::placeholder {
          color: #bbb;
        }

        .form-group input:hover {
          border-color: #c0c0c0;
        }

        .login-btn {
          padding: 0.9rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          width: 100%;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          padding: 0.8rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          margin: -0.5rem 0 0;
        }

        .error-message span {
          font-size: 1.1rem;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 0.5rem 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e8e8e8;
        }

        .divider span {
          padding: 0 1rem;
          color: #999;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .home-btn {
          padding: 0.9rem;
          background: #f8f9fa;
          color: #333;
          border: 2px solid #e8e8e8;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }

        .home-btn:hover {
          background: #e9ecef;
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .home-btn:active {
          transform: translateY(0);
        }

        .login-footer {
          text-align: center;
          margin-top: 0.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f0f0;
        }

        .login-footer p {
          font-size: 0.85rem;
          color: #888;
          background: #f8f9fa;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: inline-block;
          margin: 0 0 0.3rem 0;
        }

        .login-footer small {
          display: block;
          font-size: 0.75rem;
          color: #999;
          margin-top: 0.2rem;
        }

        .login-footer strong {
          color: #333;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .login-container {
            padding: 2rem 1.5rem;
            max-width: 100%;
          }

          .login-header h1 {
            font-size: 1.5rem;
          }

          .login-header p {
            font-size: 0.85rem;
          }

          .login-icon {
            font-size: 2.5rem;
          }

          .form-group input {
            padding: 0.8rem 0.8rem 0.8rem 2.8rem;
            font-size: 0.95rem;
          }

          .input-icon {
            left: 12px;
            font-size: 1rem;
          }

          .login-btn {
            padding: 0.8rem;
            font-size: 1rem;
          }

          .home-btn {
            padding: 0.8rem;
            font-size: 0.95rem;
          }

          .error-message {
            font-size: 0.85rem;
            padding: 0.6rem 0.8rem;
          }

          .login-footer p {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
          }
        }

        @media (max-width: 360px) {
          .login-container {
            padding: 1.5rem 1rem;
          }

          .login-header h1 {
            font-size: 1.3rem;
          }

          .form-group input {
            padding: 0.7rem 0.7rem 0.7rem 2.5rem;
            font-size: 0.9rem;
          }

          .home-btn {
            font-size: 0.85rem;
            padding: 0.7rem;
          }
        }

        /* High DPI Screens */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .login-container {
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .login-page {
            background: linear-gradient(135deg, #4a3f7a 0%, #5a3d7a 100%);
          }

          .login-container {
            background: #1a1a2e;
          }

          .login-header h1 {
            color: #e8e8e8;
          }

          .login-header p {
            color: #aaa;
          }

          .form-group label {
            color: #d0d0d0;
          }

          .form-group input {
            background: #2a2a4a;
            border-color: #3a3a5a;
            color: #e8e8e8;
          }

          .form-group input:focus {
            background: #2a2a4a;
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
          }

          .form-group input::placeholder {
            color: #888;
          }

          .form-group input:hover {
            border-color: #5a5a7a;
          }

          .input-icon {
            color: #888;
          }

          .divider::before,
          .divider::after {
            border-bottom-color: #3a3a5a;
          }

          .divider span {
            color: #888;
          }

          .home-btn {
            background: #2a2a4a;
            color: #e8e8e8;
            border-color: #3a3a5a;
          }

          .home-btn:hover {
            background: #3a3a5a;
            border-color: #667eea;
          }

          .login-footer {
            border-top-color: #3a3a5a;
          }

          .login-footer p {
            background: #2a2a4a;
            color: #aaa;
          }

          .login-footer small {
            color: #777;
          }

          .login-footer strong {
            color: #e8e8e8;
          }

          .error-message {
            background: #3a1a1a;
            border-color: #5a2a2a;
            color: #f87171;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;