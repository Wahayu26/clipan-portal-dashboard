import { X, Bell, HelpCircle, Settings, Phone, Mail, Server, RotateCcw } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Sentinel SOC Dashboard v2.0 Live',
      desc: 'Dockerized Next.js 16 + Laravel 11 cluster now live on production with real-time incident streaming.',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: '2',
      title: 'New Unified App Portal Deployed',
      desc: 'All 40+ Clipan web applications and tools unified under one central hub.',
      time: 'Just now',
      unread: true,
    },
    {
      id: '3',
      title: 'Zabbix & FortiGate Telemetry Ingest',
      desc: 'Automated syslog ingest rate expanded to 500k log buffer with 0% dropped packets.',
      time: 'Yesterday',
      unread: false,
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
              <Bell size={18} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>System Notifications</h3>
          </div>
          <button onClick={onClose} className="action-icon-btn"><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: n.unread ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
                border: n.unread ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</h5>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HelpModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <HelpCircle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>Clipan NOC & SOC Help Desk</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Contact system administrator or NOC on-duty engineer.</p>
            </div>
          </div>
          <button onClick={onClose} className="action-icon-btn"><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Phone size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>NOC HOTLINE / EXT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Ext: 8801 / 8802 (NOC Shift 24/7)</div>
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <Mail size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SUPPORT EMAIL</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>noc-support@clipan.co.id</div>
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Server size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>HOST SERVER IP</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>10.100.108.250 (dc-uat-dwilab-app-001)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsModal: React.FC<ModalProps & { onResetData: () => void }> = ({ isOpen, onClose, onResetData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <Settings size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>Portal Settings</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Manage local dashboard preferences and cache.</p>
            </div>
          </div>
          <button onClick={onClose} className="action-icon-btn"><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Restore Default Apps</h5>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Reset all application cards, favorites and order back to the default Clipan suite.
            </p>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to restore default apps and favorites?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '8px 14px', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              <RotateCcw size={14} />
              <span>Reset Portal Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
