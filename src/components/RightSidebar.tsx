import { 
  Layers, 
  FolderTree, 
  Star, 
  Clock, 
  Headphones, 
  ArrowUpRight 
} from 'lucide-react';
import type { AppItem, ActivityLog } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface RightSidebarProps {
  apps: AppItem[];
  activities: ActivityLog[];
  onLaunchApp: (appId: string) => void;
  onOpenHelp: () => void;
  onViewAllFavorites: () => void;
  onViewAllRecent: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  apps,
  activities,
  onLaunchApp,
  onOpenHelp,
  onViewAllFavorites,
  onViewAllRecent,
}) => {
  const totalApps = apps.length;
  const favoritesCount = apps.filter((a) => a.isFavorite).length;
  const recentCount = activities.length;
  const categoriesCount = 4; // security, network, monitoring, operations

  // Helper for human-readable relative time
  const formatTimeAgo = (ts: number) => {
    const diffMin = Math.floor((Date.now() - ts) / (1000 * 60));
    if (diffMin < 1) return 'Just now';
    if (diffMin === 1) return '1 minute ago';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return 'Yesterday';
  };

  return (
    <aside className="portal-right-sidebar">
      {/* Quick Stats Widget */}
      <div className="widget-card">
        <div className="widget-header">
          <h4 className="widget-title">Quick Stats</h4>
          <span onClick={onViewAllFavorites} className="widget-link">View All &rarr;</span>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <Layers size={18} />
            </div>
            <div>
              <div className="stat-val">{totalApps}</div>
              <div className="stat-lbl">Total Apps</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <FolderTree size={18} />
            </div>
            <div>
              <div className="stat-val">{categoriesCount}</div>
              <div className="stat-lbl">Categories</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <Star size={18} fill="#ffffff" />
            </div>
            <div>
              <div className="stat-val">{favoritesCount}</div>
              <div className="stat-lbl">Favorites</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
              <Clock size={18} />
            </div>
            <div>
              <div className="stat-val">{recentCount}</div>
              <div className="stat-lbl">Recently Used</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="widget-card">
        <div className="widget-header">
          <h4 className="widget-title">Recent Activity</h4>
          <span onClick={onViewAllRecent} className="widget-link">View All &rarr;</span>
        </div>

        <div className="activity-list">
          {activities.slice(0, 5).map((act) => (
            <div 
              key={act.id} 
              className="activity-item"
              onClick={() => onLaunchApp(act.appId)}
              title={`Buka ${act.appName}`}
            >
              <div 
                className="activity-icon"
                style={{ background: act.accentColor }}
              >
                <DynamicIcon name={act.iconName} size={16} color="#ffffff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="activity-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Opened <strong>{act.appName.split(' ')[0]} {act.appName.split(' ')[1] || ''}</strong>
                </div>
                <div className="activity-time">{formatTimeAgo(act.timestamp)}</div>
              </div>
              <ArrowUpRight size={14} color="var(--text-muted)" />
            </div>
          ))}

          {activities.length === 0 && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
              No recent activity yet.
            </p>
          )}
        </div>
      </div>

      {/* Motivational / System Card */}
      <div className="quote-widget">
        <p className="quote-text">
          &ldquo;A more organized workspace, a more proactive operation.&rdquo;
        </p>
        <div style={{ height: '2px', width: '32px', background: 'var(--accent-primary)', marginTop: '14px', borderRadius: '2px' }} />
      </div>

      {/* Support Card */}
      <div className="support-widget">
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#818cf8' }}>
          <Headphones size={22} />
        </div>
        <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Need something?
        </h5>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          We&apos;re here to help you keep every system running smoothly.
        </p>
        <button onClick={onOpenHelp} className="support-btn">
          <Headphones size={15} />
          <span>Contact NOC Desk</span>
        </button>
      </div>
    </aside>
  );
};
