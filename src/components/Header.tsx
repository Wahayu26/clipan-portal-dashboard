import { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, LogIn, LogOut, User as UserIcon, Shield } from 'lucide-react';
import type { UserProfile } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  user: UserProfile;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  user,
  onOpenLogin,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user.isLoggedIn ? (user.name || user.username) : 'Guest Analyst';
  const displaySubtitle = user.isLoggedIn ? (user.role || 'Clipan IT Team') : 'Klik untuk Sign In 🔒';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="portal-header">
      {/* Search Bar - Clean without hot-keys badge */}
      <div className="search-container" style={{ width: '400px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps, tools, or anything..."
          className="search-input"
        />
      </div>

      {/* Right User & Theme Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Dark / Light Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Dynamic User Profile with Dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <div 
            className="user-badge"
            onClick={() => {
              if (!user.isLoggedIn) {
                onOpenLogin();
              } else {
                setMenuOpen(!menuOpen);
              }
            }}
            style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '12px', transition: 'background-color 0.15s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            title={user.isLoggedIn ? 'Buka Menu Akun' : 'Klik untuk Login'}
          >
            <div 
              className="user-avatar"
              style={{
                background: user.isLoggedIn 
                  ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                  : 'linear-gradient(135deg, #64748b, #475569)',
              }}
            >
              {user.isLoggedIn ? initial : <UserIcon size={18} />}
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {user.isLoggedIn ? `Halo, ${displayName}!` : 'Belum Login'}
              </div>
              <div style={{ fontSize: '11px', color: user.isLoggedIn ? 'var(--text-muted)' : 'var(--accent-primary)', marginTop: '2px', fontWeight: user.isLoggedIn ? 400 : 600 }}>
                {displaySubtitle}
              </div>
            </div>
          </div>

          {/* User Dropdown Menu */}
          {menuOpen && user.isLoggedIn && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '8px',
                backgroundColor: 'var(--bg-sidebar)',
                border: '1px solid var(--border-card)',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-lg)',
                padding: '12px',
                zIndex: 50,
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                animation: 'modalPop 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Profile Card Header */}
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>@{user.username}</div>
                <div style={{ marginTop: '6px' }}>
                  <span className="category-tag" style={{ fontSize: '10px' }}>
                    <Shield size={10} style={{ display: 'inline', marginRight: '4px' }} />
                    {user.role || 'SOC Analyst'}
                  </span>
                </div>
              </div>

              {/* Logout Option */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="tab-btn"
                style={{ fontSize: '12.5px', padding: '8px 12px', width: '100%', justifyContent: 'flex-start', color: '#f43f5e' }}
              >
                <LogOut size={15} />
                <span>Sign Out / Ganti Akun</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Sign In button if not logged in */}
        {!user.isLoggedIn && (
          <button
            onClick={onOpenLogin}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '12.5px', borderRadius: '10px' }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
