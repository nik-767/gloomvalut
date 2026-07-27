import React, { useState } from 'react';
import { Lock, Mail, User, Sparkles, ShieldCheck } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || (!isLogin && !email)) {
      setError('Please fill in all fields.');
      return;
    }

    // Mock Login/Register success
    onLoginSuccess({
      id: Math.floor(Math.random() * 1000) + 10,
      username: username.toLowerCase().replace(/\s+/g, '_'),
      email: email || `${username.toLowerCase()}@gloomvault.com`
    });
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

          <button type="submit">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Info Footnote */}
        <div>
          <ShieldCheck size={14} />
          <span>Local simulated session (no API connection)</span>
        </div>
      </div>
    </div>
  );
}
