import { Star, ExternalLink } from 'lucide-react';
import type { AppItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface AppListViewProps {
  apps: AppItem[];
  onLaunch: (app: AppItem, newTab?: boolean) => void;
  onToggleFavorite: (appId: string) => void;
}

export const AppListView: React.FC<AppListViewProps> = ({
  apps,
  onLaunch,
  onToggleFavorite,
}) => {
  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '14px 20px', width: '40px' }}>Fav</th>
            <th style={{ padding: '14px 20px' }}>Application</th>
            <th style={{ padding: '14px 20px' }}>Category</th>
            <th style={{ padding: '14px 20px' }}>Description</th>
            <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr
              key={app.id}
              onClick={() => onLaunch(app, true)}
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Star Favorite */}
              <td style={{ padding: '14px 20px' }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onToggleFavorite(app.id)}
                  className={`action-icon-btn ${app.isFavorite ? 'active-star' : ''}`}
                >
                  <Star size={15} fill={app.isFavorite ? '#eab308' : 'none'} />
                </button>
              </td>

              {/* Name & Icon */}
              <td style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      background: app.bgGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0
                    }}
                  >
                    <DynamicIcon name={app.iconName} size={16} color="#ffffff" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.name}</span>
                    {app.badge && (
                      <span className="app-badge-new" style={{ marginLeft: '8px' }}>{app.badge}</span>
                    )}
                  </div>
                </div>
              </td>

              {/* Category */}
              <td style={{ padding: '14px 20px' }}>
                <span className="category-tag">{app.category}</span>
              </td>

              {/* Description */}
              <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {app.description}
              </td>

              {/* Launch */}
              <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunch(app, true);
                  }}
                >
                  <span>Open</span>
                  <ExternalLink size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
