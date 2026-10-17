import React, { useRef, useEffect } from 'react';
import { Search, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  userName = 'Aji',
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="portal-header">
      {/* Search Bar */}
      <div className="search-container">
        <Search size={18} color="var(--text-muted)" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps, tools, or anything..."
          className="search-input"
        />
        <div className="kbd-shortcut">Ctrl K</div>
      </div>

      {/* Right User & Theme Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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

        {/* User Badge */}
        <div className="user-badge">
          <div className="user-avatar">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Halo, {userName}!
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Good to see you again 👋
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
