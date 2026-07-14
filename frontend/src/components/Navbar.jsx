import React from 'react';
import { Compass, Home, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar({ activeView, onViewChange, currentUser, onLogout }) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: '16px',
      margin: '16px auto',
      width: 'calc(100% - 32px)',
      maxWidth: '1200px',
      zIndex: 100,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px'
    }}>
      {/* Branding */}
      <div 
        onClick={() => onViewChange('feed')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
        }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '-0.03em'
        }}>
          GLOOM<span className="text-gradient">VAULT</span>
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={() => onViewChange('feed')}
          className={`btn ${activeView === 'feed' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Home size={16} />
          <span style={{ display: 'inline' }}>Feed</span>
        </button>

        <button 
          onClick={() => onViewChange('explore')}
          className={`btn ${activeView === 'explore' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Compass size={16} />
          <span style={{ display: 'inline' }}>Explore</span>
        </button>

        <button 
          onClick={() => onViewChange('profile', currentUser.id)}
          className={`btn ${activeView === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <User size={16} />
          <span style={{ display: 'inline' }}>My Profile</span>
        </button>
      </div>

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--accent-primary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            {currentUser.username.substring(0, 2).toUpperCase()}
          </div>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'inline'
          }}>
            {currentUser.username}
          </span>
        </div>

        <button 
          onClick={onLogout}
          className="btn btn-ghost" 
          style={{ 
            padding: '8px', 
            borderRadius: '50%', 
            minWidth: '36px', 
            height: '36px',
            color: 'var(--danger)'
          }}
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
