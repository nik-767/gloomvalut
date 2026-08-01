import React from 'react';
import { Compass, Home, User, LogOut, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Top navigation bar shown on every authenticated page.
 */
export default function Navbar({ currentUser, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  return (
    <nav className="gv-nav">
      <Link to="/" className="gv-nav-brand">
        <span className="gv-nav-icon">
          <Sparkles size={18} />
        </span>
        <span>GLOOMVAULT</span>
      </Link>

      <div className="gv-nav-links">
        <Link to="/" className={`gv-nav-link ${isActive('/') ? 'active' : ''}`}>
          <Home size={16} />
          <span>Feed</span>
        </Link>

        <Link to="/explore" className={`gv-nav-link ${isActive('/explore') ? 'active' : ''}`}>
          <Compass size={16} />
          <span>Explore</span>
        </Link>

        {currentUser?.id && (
          <Link
            to={`/profile/${currentUser.id}`}
            className={`gv-nav-link ${isActive(`/profile/${currentUser.id}`) ? 'active' : ''}`}
          >
            <User size={16} />
            <span>My Profile</span>
          </Link>
        )}
      </div>

      <div className="gv-nav-user">
        <div className="gv-field-inline">
          <div className="gv-avatar">
            {currentUser?.username?.substring(0, 2).toUpperCase()}
          </div>
          <span>{currentUser?.username}</span>
        </div>

        <button className="gv-btn gv-btn-ghost" onClick={onLogout} title="Sign Out" type="button">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
