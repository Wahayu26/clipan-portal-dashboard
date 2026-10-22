import { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  MoreVertical, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2,
  Pencil,
  ArrowUpRight 
} from 'lucide-react';
import type { AppItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface AppCardProps {
  app: AppItem;
  onLaunch: (app: AppItem, newTab?: boolean) => void;
  onToggleFavorite: (appId: string) => void;
  onEditApp?: (app: AppItem) => void;
  onDeleteApp?: (app: AppItem) => void;
  onDeleteCustom?: (appId: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  onLaunch,
  onToggleFavorite,
  onEditApp,
  onDeleteApp,
  onDeleteCustom,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + app.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 1200);
  };

  return (
    <div 
      className="app-card"
      onClick={() => onLaunch(app, true)}
      title={`Buka ${app.name}`}
    >
      {/* Card Header: Icon & Top Actions */}
      <div className="app-card-header">
        <div 
          className="app-icon-wrapper" 
          style={{ background: app.bgGradient }}
        >
          <DynamicIcon name={app.iconName} size={22} color="#ffffff" />
        </div>

        <div className="app-actions" onClick={(e) => e.stopPropagation()}>
          {/* Star Favorite Button */}
          <button
            onClick={() => onToggleFavorite(app.id)}
            className={`action-icon-btn ${app.isFavorite ? 'active-star' : ''}`}
            title={app.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={16} fill={app.isFavorite ? '#eab308' : 'none'} />
          </button>

          {/* 3-Dots Action Dropdown */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="action-icon-btn"
              title="More options"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  zIndex: 20,
                  minWidth: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLaunch(app, true);
                  }}
                  className="tab-btn"
                  style={{ fontSize: '12px', padding: '6px 10px', width: '100%', justifyContent: 'flex-start' }}
                >
                  <ExternalLink size={14} />
                  <span>Open New Tab</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="tab-btn"
                  style={{ fontSize: '12px', padding: '6px 10px', width: '100%', justifyContent: 'flex-start' }}
                >
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                {onEditApp && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEditApp(app);
                    }}
                    className="tab-btn"
                    style={{ fontSize: '12px', padding: '6px 10px', width: '100%', justifyContent: 'flex-start' }}
                  >
                    <Pencil size={14} color="var(--accent-primary)" />
                    <span>Edit App</span>
                  </button>
                )}

                {(onDeleteApp || (app.isCustom && onDeleteCustom)) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      if (onDeleteApp) {
                        onDeleteApp(app);
                      } else if (onDeleteCustom) {
                        onDeleteCustom(app.id);
                      }
                    }}
                    className="tab-btn"
                    style={{ fontSize: '12px', padding: '6px 10px', width: '100%', justifyContent: 'flex-start', color: '#f43f5e' }}
                  >
                    <Trash2 size={14} color="#f43f5e" />
                    <span style={{ color: '#f43f5e' }}>Delete App</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="app-title">{app.name}</h3>
      <p className="app-desc">{app.description}</p>

      {/* Footer Info */}
      <div className="app-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="category-tag">
            {app.category}
          </span>
          {app.badge && (
            <span className="app-badge-new">
              {app.badge}
            </span>
          )}
        </div>

        <div className="open-link-indicator">
          <span>Launch</span>
          <ArrowUpRight size={13} />
        </div>
      </div>
    </div>
  );
};
