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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Graphic Effects */}
      <div className="bg-glow-top" />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, rgba(139, 92, 246, 0) 70%)',
        top: '20%',
        left: '10%',
        pointerEvents: 'none',
        filter: 'blur(50px)'
      }} />

      <div className="glass-panel animate-fade-in glow-pulse" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo and Greeting */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '-0.04em' }}>
            GLOOM<span className="text-gradient">VAULT</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? 'Enter the sanctuary of castle lovers' : 'Join the guild of castle enthusiasts'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(10, 9, 21, 0.6)',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '28px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            className="btn"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              background: isLogin ? 'var(--bg-tertiary)' : 'transparent',
              color: isLogin ? 'var(--text-primary)' : 'var(--text-muted)',
              border: isLogin ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              background: !isLogin ? 'var(--bg-tertiary)' : 'transparent',
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-muted)',
              border: !isLogin ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="name@gloomvault.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Info Footnote */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '28px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} />
          <span>Local simulated session (no API connection)</span>
        </div>
      </div>
    </div>
  );
}
