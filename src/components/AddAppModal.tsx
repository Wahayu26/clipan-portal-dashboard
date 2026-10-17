import { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import type { AppItem, AppCategory } from '../types';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (newApp: AppItem) => void;
}

const AVAILABLE_ICONS = [
  'Layers', 'Shield', 'ShieldCheck', 'Activity', 'BarChart3', 'Database',
  'Network', 'Server', 'Flame', 'Cpu', 'Map', 'Terminal', 'Lock', 'Radio',
  'Wifi', 'GitPullRequest', 'TrendingUp', 'BookOpen', 'Ticket', 'Briefcase'
];

const AVAILABLE_COLORS = [
  { name: 'Indigo', hex: '#6366f1', grad: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  { name: 'Cyan', hex: '#06b6d4', grad: 'linear-gradient(135deg, #06b6d4, #0284c7)' },
  { name: 'Emerald', hex: '#10b981', grad: 'linear-gradient(135deg, #34d399, #059669)' },
  { name: 'Rose', hex: '#f43f5e', grad: 'linear-gradient(135deg, #fb7185, #e11d48)' },
  { name: 'Amber', hex: '#f59e0b', grad: 'linear-gradient(135deg, #fbbf24, #d97706)' },
  { name: 'Purple', hex: '#8b5cf6', grad: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
];

export const AddAppModal: React.FC<AddAppModalProps> = ({ isOpen, onClose, onAddApp }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AppCategory>('operations');
  const [iconName, setIconName] = useState('Layers');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    const newApp: AppItem = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      url: url.trim().startsWith('/') || url.trim().startsWith('http') ? url.trim() : '/' + url.trim(),
      description: description.trim() || 'Internal Clipan enterprise tool.',
      category,
      iconName,
      accentColor: selectedColor.hex,
      bgGradient: selectedColor.grad,
      status: 'online',
      isCustom: true,
      launchCount: 0,
      badge: 'CUSTOM',
    };

    onAddApp(newApp);
    onClose();
    // Reset form
    setName('');
    setUrl('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>Add New Web App</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Integrate any internal URL or project into your portal.</p>
            </div>
          </div>
          <button onClick={onClose} className="action-icon-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Application Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core Switch Console"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL or Path *</label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. /my-project/ or https://10.100.108.x/..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the tool..."
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Category</label>
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
              <label className="form-label">Icon</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="form-input"
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color Theme</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {AVAILABLE_COLORS.map((c) => (
                <div
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: c.grad,
                    cursor: 'pointer',
                    boxShadow: selectedColor.name === c.name ? '0 0 0 3px #ffffff, 0 0 10px rgba(0,0,0,0.5)' : 'none',
                    transform: selectedColor.name === c.name ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Add to Portal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
