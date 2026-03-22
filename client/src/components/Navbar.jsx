import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useCallback } from 'react';

function KeyboardIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="6" width="30" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
      <rect x="5" y="10" width="4" height="3" rx="0.5" fill="var(--purple-500)" />
      <rect x="11" y="10" width="4" height="3" rx="0.5" fill="var(--purple-400)" />
      <rect x="17" y="10" width="4" height="3" rx="0.5" fill="var(--purple-500)" />
      <rect x="23" y="10" width="4" height="3" rx="0.5" fill="var(--purple-400)" />
      <rect x="5" y="15" width="4" height="3" rx="0.5" fill="var(--purple-400)" />
      <rect x="11" y="15" width="4" height="3" rx="0.5" fill="var(--purple-500)" />
      <rect x="17" y="15" width="4" height="3" rx="0.5" fill="var(--purple-400)" />
      <rect x="23" y="15" width="4" height="3" rx="0.5" fill="var(--purple-500)" />
      <rect x="8" y="20" width="16" height="3" rx="0.5" fill="var(--purple-300)" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => { });
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <KeyboardIcon />
          Prompt
        </Link>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/test" className={isActive('/test')} onClick={() => setMenuOpen(false)}>Test</Link>
          <Link to="/race" className={isActive('/race')} onClick={() => setMenuOpen(false)}>Race</Link>
          <Link to="/multiplayer" className={isActive('/multiplayer')} onClick={() => setMenuOpen(false)}>Multiplayer</Link>
          <Link to="/leaderboard" className={isActive('/leaderboard')} onClick={() => setMenuOpen(false)}>Leaderboard</Link>
          <Link to="/practice" className={isActive('/practice')} onClick={() => setMenuOpen(false)}>Practice</Link>
          <Link to="/feedback" className={isActive('/feedback')} onClick={() => setMenuOpen(false)}>Feedback</Link>
        </div>

        <div className="navbar-right">

          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <Link to="/profile" className="btn btn-ghost btn-sm">
                {user.username}
              </Link>
              <button onClick={logout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
          <button className="theme-toggle" onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? '⊡' : '⛶'}
          </button>
        </div>
      </div>
    </nav>
  );
}

