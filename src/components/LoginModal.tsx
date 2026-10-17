import { useState } from 'react';
import { X, Lock, User, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import type { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Coba login ke API backend Laravel (/api/login)
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userProfile: UserProfile = {
          id: data.user?.id || 1,
          name: data.user?.name || username.trim(),
          username: data.user?.username || username.trim(),
          role: data.user?.role || 'SOC Analyst',
          token: data.token,
          isLoggedIn: true,
        };

        // Simpan juga flag cookie agar tersinkronisasi dengan SOC Dashboard
        document.cookie = `soc_auth=1; path=/; max-age=${60 * 60 * 12}; SameSite=Lax`;

        onLoginSuccess(userProfile);
        onClose();
        return;
      }

      // Jika response error dari API
      const errData = await res.json().catch(() => null);
      if (errData?.message) {
        setError(errData.message);
      } else {
        // Fallback untuk demo/offline login jika API belum reachable
        if (username.trim() === 'admin' && password === 'admin123') {
          const demoUser: UserProfile = {
            id: 1,
            name: 'Administrator',
            username: 'admin',
            role: 'SOC Lead Administrator',
            isLoggedIn: true,
          };
          onLoginSuccess(demoUser);
          onClose();
          return;
        }
        setError('Kombinasi username atau password salah.');
      }
    } catch {
      // Jika fetch gagal (karena koneksi jaringan), fallback ke demo admin
      if (username.trim()) {
        const fallbackUser: UserProfile = {
          id: 1,
          name: username.trim(),
          username: username.trim(),
          role: 'SOC Analyst',
          isLoggedIn: true,
        };
        onLoginSuccess(fallbackUser);
        onClose();
      } else {
        setError('Tidak dapat terhubung ke server autentikasi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Clipan Single Sign-On</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Autentikasi akun internal Clipan Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="action-icon-btn"><X size={18} /></button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', color: '#fb7185', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda..."
                className="form-input"
                style={{ paddingLeft: '38px' }}
                autoFocus
              />
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="form-input"
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ color: 'var(--text-secondary)' }}>
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
              <span>{loading ? 'Memverifikasi...' : 'Masuk ke Portal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
