import { 
  Home, 
  Grid, 
  Star, 
  Clock, 
  Layers, 
  Bell, 
  Settings, 
  HelpCircle,
  Hexagon
} from 'lucide-react';
import type { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  appsCount: number;
  favoritesCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  appsCount,
  favoritesCount,
  onOpenNotifications,
  onOpenSettings,
  onOpenHelp,
}) => {
  return (
    <aside className="portal-sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
        <div 
          style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.45)'
          }}
        >
          <Hexagon size={22} color="#ffffff" fill="rgba(255,255,255,0.2)" />
        </div>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Clipan<span style={{ color: '#818cf8' }}>Portal</span>
          </h2>
          <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
            One Place. Many Possibilities.
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('home')}
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', borderRadius: '10px' }}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Grid size={18} />
            <span>All Apps</span>
          </div>
          <span className="tab-counter">{appsCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Star size={18} />
            <span>Favorites</span>
          </div>
          {favoritesCount > 0 && <span className="tab-counter">{favoritesCount}</span>}
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', borderRadius: '10px' }}
        >
          <Clock size={18} />
          <span>Recent</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', borderRadius: '10px' }}
        >
          <Layers size={18} />
          <span>Categories</span>
        </button>
      </nav>

      {/* Tools Section */}
      <div style={{ marginBottom: 'auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: '14px', marginBottom: '10px' }}>
          Tools
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={onOpenNotifications}
            className="tab-btn"
            style={{ width: '100%', justifyContent: 'space-between', padding: '9px 14px', borderRadius: '10px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={17} />
              <span>Notifications</span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '999px', background: '#f43f5e', color: '#ffffff' }}>
              3
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="tab-btn"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '9px 14px', borderRadius: '10px' }}
          >
            <Settings size={17} />
            <span>Settings</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="tab-btn"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '9px 14px', borderRadius: '10px' }}
          >
            <HelpCircle size={17} />
            <span>Help & Support</span>
          </button>
        </div>
      </div>

      {/* Bottom Scenic Quote Card */}
      <div className="sidebar-quote-card">
        <p className="sidebar-quote-text">
          &ldquo;Good tools create greater work.&rdquo;
        </p>
        <p className="sidebar-quote-author">
          — Clipan Workspace
        </p>
      </div>
    </aside>
  );
};
