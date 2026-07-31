import React, { useState } from 'react';
import { Lock, Mail, User, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login, registerUser } from '../api/authapi';

export default function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || (!isLogin && !email)) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login({ username, password });
      } else {
        await registerUser({ username, email, password });
        // Auto-login after successful registration
        await login({ username, password });
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        {/* Logo and Greeting */}
        <div>
          <div>
            <Sparkles size={24} />
          </div>
          <h1>
            GLOOMVAULT
          </h1>
          <p>
            {isLogin ? 'Enter the sanctuary of castle lovers' : 'Join the guild of castle enthusiasts'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Username
            </label>
            <div>
              <User size={16} />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label>
                Email Address
              </label>
              <div>
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="name@gloomvault.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label>
              Password
            </label>
            <div>
              <Lock size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Info Footnote */}
        <div>
          <ShieldCheck size={14} />
          <span>Secured via JWT authentication</span>
        </div>
      </div>
    </div>
  );
}
