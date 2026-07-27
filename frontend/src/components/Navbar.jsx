import React from 'react';
import { Compass, Home, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar({ activeView, onViewChange, currentUser, onLogout }) {
  return (
    <nav>
      {/* Branding */}
      <div onClick={() => onViewChange('feed')}>
        <div>
          <Sparkles size={18} />
        </div>
        <span>
          GLOOMVAULT
        </span>
      </div>

      {/* Nav Links */}
      <div>
        <button onClick={() => onViewChange('feed')}>
          <Home size={16} />
          <span>Feed</span>
        </button>

        <button onClick={() => onViewChange('explore')}>
          <Compass size={16} />
          <span>Explore</span>
        </button>

        <button onClick={() => onViewChange('profile', currentUser?.id)}>
          <User size={16} />
          <span>My Profile</span>
        </button>
      </div>

      {/* User Actions */}
      <div>
        <div>
          <div>
            {currentUser?.username.substring(0, 2).toUpperCase()}
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
