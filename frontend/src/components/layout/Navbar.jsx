import React from 'react';
import { Compass, Home, User, LogOut, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ currentUser, onLogout }) {
  return (
    <nav>
      {/* Branding */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
        <div>
          <Sparkles size={18} />
        </div>
        <span>
          GLOOMVAULT
        </span>
      </Link>

      {/* Nav Links */}
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Home size={16} />
          <span>Feed</span>
        </Link>

        <Link to="/explore" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Compass size={16} />
          <span>Explore</span>
        </Link>

        {currentUser?.id && (
          <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <User size={16} />
            <span>My Profile</span>
          </Link>
        )}
      </div>

      {/* User Actions */}
      <div>
        <div>
          <div>
            {currentUser?.username?.substring(0, 2).toUpperCase()}
          </div>
          <span>
            {currentUser?.username}
          </span>
        </div>

        <button onClick={onLogout} title="Sign Out">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
