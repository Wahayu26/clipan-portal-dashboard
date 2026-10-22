import { useState } from 'react';
import { X, Pencil, Check, RotateCcw, Sparkles } from 'lucide-react';
import type { AppItem, AppCategory } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface EditAppModalProps {
  isOpen: boolean;
  app: AppItem | null;
  onClose: () => void;
  onSaveApp: (updatedApp: AppItem) => void;
  onResetApp?: (appId: string) => void;
}

const AVAILABLE_ICONS = [
  'Shield', 'ShieldCheck', 'ShieldAlert', 'Lock', 'Activity', 'BarChart3', 
  'Flame', 'Radio', 'Server', 'Database', 'Network', 'Layers', 'Cpu', 
  'Terminal', 'Globe', 'Wifi', 'GitPullRequest', 'TrendingUp', 'BookOpen', 
  'Ticket', 'Briefcase', 'Map', 'Folder', 'Zap', 'Search', 'Bell', 'Key', 
  'Compass', 'SlidersHorizontal', 'CheckCircle2', 'ExternalLink', 'FileText'
];

const AVAILABLE_COLORS = [
  { name: 'Cyan', hex: '#06b6d4', grad: 'linear-gradient(135deg, #06b6d4, #0284c7)' },
  { name: 'Indigo', hex: '#6366f1', grad: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  { name: 'Emerald', hex: '#10b981', grad: 'linear-gradient(135deg, #34d399, #059669)' },
  { name: 'Rose', hex: '#f43f5e', grad: 'linear-gradient(135deg, #fb7185, #e11d48)' },
  { name: 'Amber', hex: '#f59e0b', grad: 'linear-gradient(135deg, #fbbf24, #d97706)' },
  { name: 'Purple', hex: '#8b5cf6', grad: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
  { name: 'Orange', hex: '#ea580c', grad: 'linear-gradient(135deg, #f97316, #c2410c)' },
  { name: 'Blue', hex: '#2563eb', grad: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
];

const BADGE_PRESETS = ['NEW v2.0', 'CORE', 'PROD', 'HOT', 'BETA'];

interface EditAppContentProps {
  app: AppItem;
  onClose: () => void;
  onSaveApp: (updatedApp: AppItem) => void;
  onResetApp?: (appId: string) => void;
}

const EditAppContent: React.FC<EditAppContentProps> = ({
  app,
  onClose,
  onSaveApp,
  onResetApp,
}) => {
  const [name, setName] = useState(app.name || '');
  const [url, setUrl] = useState(app.url || '');
  const [description, setDescription] = useState(app.description || '');
  const [category, setCategory] = useState<AppCategory>(app.category || 'security');
  const [iconName, setIconName] = useState(app.iconName || 'ShieldCheck');
  const [badge, setBadge] = useState(app.badge || '');
  const [status, setStatus] = useState<'online' | 'maintenance' | 'offline'>(app.status || 'online');
  const [selectedColor, setSelectedColor] = useState(() => {
    return (
      AVAILABLE_COLORS.find(
        (c) => c.hex.toLowerCase() === (app.accentColor || '').toLowerCase()
      ) || {
        name: 'Custom',
        hex: app.accentColor || '#6366f1',
        grad: app.bgGradient || 'linear-gradient(135deg, #6366f1, #4f46e5)',
      }
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    const formattedUrl =
      url.trim().startsWith('/') || url.trim().startsWith('http://') || url.trim().startsWith('https://')
        ? url.trim()
        : '/' + url.trim();

    const updatedApp: AppItem = {
      ...app,
      name: name.trim(),
      url: formattedUrl,
      description: description.trim() || 'Internal Clipan enterprise tool.',
      category,
      iconName,
      badge: badge.trim() || undefined,
      accentColor: selectedColor.hex,
      bgGradient: selectedColor.grad,
      status,
      isEdited: true,
    };

    onSaveApp(updatedApp);
    onClose();
  };

  return (
    <div 
      className="modal-window" 
      onClick={(e) => e.stopPropagation()} 
      style={{ maxWidth: '580px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Modal Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0 }}>
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
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            <Pencil size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Edit Web Application
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Modifikasi URL, nama, icon, kategori, atau tampilan kartu aplikasi ini.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="action-icon-btn" title="Tutup">
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <div style={{ overflowY: 'auto', paddingRight: '4px', flex: 1 }}>
        {/* Real-time Live Preview Card */}
        <div 
          style={{ 
            padding: '14px', 
            borderRadius: '14px', 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border-card)', 
            marginBottom: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="var(--accent-primary)" />
              Live Card Preview
            </span>
            <span 
              style={{ 
                fontSize: '10px', 
                fontFamily: 'var(--font-mono)', 
                padding: '2px 8px', 
                borderRadius: '6px',
                backgroundColor: status === 'online' ? 'rgba(16, 185, 129, 0.15)' : status === 'maintenance' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: status === 'online' ? '#10b981' : status === 'maintenance' ? '#f59e0b' : '#f43f5e',
                fontWeight: 600
              }}
            >
              ● {status.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div 
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: selectedColor.grad, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#ffffff',
                boxShadow: `0 4px 12px ${selectedColor.hex}40`,
                flexShrink: 0
              }}
            >
              <DynamicIcon name={iconName} size={22} color="#ffffff" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {name.trim() || 'Untitled Application'}
                </h4>
                {badge.trim() && (
                  <span className="app-badge-new">{badge.trim()}</span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {description.trim() || 'Deskripsi singkat aplikasi...'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span className="category-tag">{category}</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {url.trim() || '/path'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form id="edit-app-form" onSubmit={handleSubmit}>
          {/* Application Name */}
          <div className="form-group">
            <label className="form-label">Nama Aplikasi *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sentinel SOC Center"
              className="form-input"
            />
          </div>

          {/* URL or Path */}
          <div className="form-group">
            <label className="form-label">URL atau Path Internal *</label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Contoh: /soc-dashboard-finale/login atau https://10.100.108.x/..."
              className="form-input"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Deskripsi Aplikasi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat fungsi dan tujuan aplikasi..."
              className="form-input"
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Category & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label className="form-label">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AppCategory)}
                className="form-input"
              >
                <option value="security">Security (SOC)</option>
                <option value="network">Network (NOC)</option>
                <option value="monitoring">Monitoring</option>
                <option value="operations">Operations & IT</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="form-label">Status Aplikasi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'online' | 'maintenance' | 'offline')}
                className="form-input"
              >
                <option value="online">Online / Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Badge & Tag */}
          <div className="form-group">
            <label className="form-label">Badge Tag (Opsional)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Contoh: NEW v2.0, CORE, HOT..."
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {BADGE_PRESETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBadge(b)}
                  className="tab-btn"
                  style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '6px' }}
                >
                  {b}
                </button>
              ))}
              {badge && (
                <button
                  type="button"
                  onClick={() => setBadge('')}
                  className="tab-btn"
                  style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '6px', color: '#f43f5e' }}
                >
                  Hapus Badge
                </button>
              )}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="form-group">
            <label className="form-label">Pilih Icon Aplikasi</label>
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(8, 1fr)', 
                gap: '6px', 
                maxHeight: '120px', 
                overflowY: 'auto', 
                padding: '8px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-card)'
              }}
            >
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIconName(ic)}
                  title={ic}
                  style={{
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: iconName === ic ? '2px solid var(--accent-primary)' : '1px solid transparent',
                    backgroundColor: iconName === ic ? 'var(--accent-glow)' : 'transparent',
                    color: iconName === ic ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <DynamicIcon name={ic} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Color Theme Presets */}
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label">Tema Warna Kartu</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {AVAILABLE_COLORS.map((c) => (
                <div
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: c.grad,
                    cursor: 'pointer',
                    border: selectedColor.name === c.name ? '3px solid #ffffff' : '2px solid transparent',
                    boxShadow: selectedColor.name === c.name ? `0 0 12px ${c.hex}80` : 'none',
                    transform: selectedColor.name === c.name ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.15s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Modal Footer Actions */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingTop: '16px', 
          borderTop: '1px solid var(--border-card)', 
          marginTop: '12px',
          flexShrink: 0
        }}
      >
        {onResetApp && !app.isCustom ? (
          <button
            type="button"
            onClick={() => {
              if (confirm(`Kembalikan pengaturan aplikasi "${app.name}" ke konfigurasi bawaan portal?`)) {
                onResetApp(app.id);
                onClose();
              }
            }}
            className="tab-btn"
            style={{ fontSize: '12px', padding: '6px 10px', color: 'var(--text-muted)' }}
            title="Reset ke pengaturan bawaan awal"
          >
            <RotateCcw size={13} />
            <span>Reset Default</span>
          </button>
        ) : (
          <div />
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            Batal
          </button>
          <button
            type="submit"
            form="edit-app-form"
            className="btn-primary"
            style={{ fontSize: '13px', padding: '8px 18px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            <Check size={15} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditAppModal: React.FC<EditAppModalProps> = ({
  isOpen,
  app,
  onClose,
  onSaveApp,
  onResetApp,
}) => {
  if (!isOpen || !app) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <EditAppContent
        key={app.id}
        app={app}
        onClose={onClose}
        onSaveApp={onSaveApp}
        onResetApp={onResetApp}
      />
    </div>
  );
};
