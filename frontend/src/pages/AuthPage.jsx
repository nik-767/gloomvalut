import React, { useState } from 'react';
import { Lock, Mail, User, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../api/authapi';

/**
 * Login and registration screen shown before the user enters the app.
 */
export default function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /** Sends login or register requests and persists the returned JWT session. */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password;

    if (!trimmedUsername || !trimmedPassword || (!isLogin && !trimmedEmail)) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login({ username: trimmedUsername, password: trimmedPassword });
      } else {
        await registerUser({
          username: trimmedUsername,
          email: trimmedEmail,
          password: trimmedPassword,
        });
        await login({ username: trimmedUsername, password: trimmedPassword });
      }
    } catch (err) {
      const backendMessage = err?.response?.data;
      const detail =
        backendMessage?.detail ||
        backendMessage?.message ||
        backendMessage?.error ||
        (typeof backendMessage === 'string' ? backendMessage : null) ||
        backendMessage?.username?.[0] ||
        backendMessage?.email?.[0] ||
        backendMessage?.password?.[0] ||
        'Something went wrong. Please try again.';

      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gv-auth-shell">
      <div className="gv-card gv-auth-card">
        <div className="gv-auth-brand">
          <div className="gv-nav-icon" style={{ margin: '0 auto 1rem' }}>
            <Sparkles size={24} />
          </div>
          <h1>GLOOMVAULT</h1>
          <p>
            {isLogin
              ? 'Enter the sanctuary of castle lovers'
              : 'Join the guild of castle enthusiasts'}
          </p>
        </div>

        <div className="gv-auth-tabs">
          <button
            type="button"
            className={`gv-btn ${isLogin ? 'gv-btn-primary' : 'gv-btn-ghost'}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`gv-btn ${!isLogin ? 'gv-btn-primary' : 'gv-btn-ghost'}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Register
          </button>
        </div>

        {error && <div className="gv-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="gv-field">
            <label>Username</label>
            <div className="gv-field-inline gv-searchbar">
              <User size={16} />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="gv-field">
              <label>Email Address</label>
              <div className="gv-field-inline gv-searchbar">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="name@gloomvault.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
          )}

          <div className="gv-field">
            <label>Password</label>
            <div className="gv-field-inline gv-searchbar">
              <Lock size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>

          <button className="gv-btn gv-btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="gv-auth-footnote">
          <ShieldCheck size={14} />
          <span>Secured via JWT authentication</span>
        </div>
      </div>
    </div>
  );
}
