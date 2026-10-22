import { useState, useMemo } from 'react';
import { X, Search, Plus, Pencil, Trash2, ExternalLink, SlidersHorizontal, Star } from 'lucide-react';
import type { AppItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface ManageAppsModalProps {
  isOpen: boolean;
  apps: AppItem[];
  onClose: () => void;
  onEditApp: (app: AppItem) => void;
  onDeleteApp: (app: AppItem) => void;
  onOpenAddModal: () => void;
  onToggleFavorite: (appId: string) => void;
  onLaunchApp: (app: AppItem) => void;
}

export const ManageAppsModal: React.FC<ManageAppsModalProps> = ({
  isOpen,
  apps,
  onClose,
  onEditApp,
  onDeleteApp,
  onOpenAddModal,
  onToggleFavorite,
  onLaunchApp,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        !search.trim() ||
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description.toLowerCase().includes(search.toLowerCase()) ||
        app.url.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || app.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [apps, search, categoryFilter]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                Manage Web Applications
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Kelola, edit konfigurasi, dan tambahkan aplikasi web portal ({apps.length} Total Aplikasi).
              </p>
            </div>
          </div>
          <button onClick={onClose} className="action-icon-btn" title="Tutup">
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Search, Filter, and Add Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            flexShrink: 0,
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Cari nama aplikasi atau URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', fontSize: '12.5px', padding: '8px 12px 8px 34px' }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', fontSize: '12.5px', padding: '8px 12px' }}
          >
            <option value="all">Semua Kategori</option>
            <option value="security">Security (SOC)</option>
            <option value="network">Network (NOC)</option>
            <option value="monitoring">Monitoring</option>
            <option value="operations">Operations & IT</option>
            <option value="other">Other</option>
          </select>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAddModal();
            }}
            className="btn-primary"
            style={{ fontSize: '12px', padding: '8px 14px', whiteSpace: 'nowrap' }}
          >
            <Plus size={14} />
            <span>Tambah Aplikasi</span>
          </button>
        </div>

        {/* Scrollable Apps Table List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          {filteredApps.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredApps.map((app, index) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom:
                      index === filteredApps.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                    transition: 'background-color 0.15s ease',
                    gap: '12px',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  {/* Left: Star + Icon + Name & Info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(app.id)}
                      className={`action-icon-btn ${app.isFavorite ? 'active-star' : ''}`}
                      title={app.isFavorite ? 'Hapus favorit' : 'Jadikan favorit'}
                    >
                      <Star size={14} fill={app.isFavorite ? '#eab308' : 'none'} />
                    </button>

                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: app.bgGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      <DynamicIcon name={app.iconName} size={16} color="#fff" />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '13px',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {app.name}
                        </span>
                        {app.badge && (
                          <span className="app-badge-new" style={{ fontSize: '9px', padding: '1px 6px' }}>
                            {app.badge}
                          </span>
                        )}
                        {app.isEdited && (
                          <span
                            style={{
                              fontSize: '9px',
                              fontFamily: 'var(--font-mono)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(99, 102, 241, 0.15)',
                              color: 'var(--accent-primary)',
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                            }}
                          >
                            MODIFIED
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span className="category-tag" style={{ fontSize: '10px', padding: '1px 6px' }}>
                          {app.category}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '240px',
                          }}
                        >
                          {app.url}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Launch, Edit, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => onLaunchApp(app)}
                      className="action-icon-btn"
                      title={`Buka ${app.name}`}
                    >
                      <ExternalLink size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditApp(app);
                      }}
                      className="action-icon-btn"
                      style={{ color: 'var(--accent-primary)' }}
                      title={`Edit ${app.name}`}
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onDeleteApp(app);
                      }}
                      className="action-icon-btn"
                      style={{ color: '#f43f5e' }}
                      title={`Hapus ${app.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
              Tidak ada aplikasi yang sesuai dengan filter &ldquo;{search}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '14px',
            marginTop: '8px',
            borderTop: '1px solid var(--border-card)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Menampilkan {filteredApps.length} dari {apps.length} aplikasi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
