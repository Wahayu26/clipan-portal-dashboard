import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Grid3X3, 
  List, 
  Search
} from 'lucide-react';
import type { 
  AppItem, 
  ActivityLog, 
  UserProfile,
  ViewMode, 
  SortOption, 
  ActiveTab 
} from './types';
import { INITIAL_APPS, INITIAL_ACTIVITIES } from './data/initialApps';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AppCard } from './components/AppCard';
import { AppListView } from './components/AppListView';
import { RightSidebar } from './components/RightSidebar';
import { AddAppModal } from './components/AddAppModal';
import { LoginPage } from './components/LoginPage';
import { NotificationsModal, HelpModal, SettingsModal, ConfirmDeleteModal } from './components/Modals';
import { isSessionValid, terminateSession, saveUserSession, refreshAuthCookie } from './utils/security';

const STORAGE_KEYS = {
  APPS: 'clipan_portal_apps_v1',
  ACTIVITIES: 'clipan_portal_activities_v1',
  THEME: 'clipan_portal_theme',
  VIEW_MODE: 'clipan_portal_view_mode',
  USER: 'clipan_portal_user',
  DELETED_APPS: 'clipan_portal_deleted_apps_v1',
};

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved !== null ? saved === 'true' : true;
  });

  // User Profile state with session validation
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      // 1. Cek portal user tersimpan
      const portalUserRaw = localStorage.getItem(STORAGE_KEYS.USER);
      if (portalUserRaw) {
        const parsed: UserProfile = JSON.parse(portalUserRaw);
        if (isSessionValid(parsed)) {
          return parsed;
        }
      }

      // 2. Cek apakah ada session login aktif dari Sentinel SOC Dashboard
      const socAuthRaw = localStorage.getItem('soc-auth');
      if (socAuthRaw) {
        const parsed = JSON.parse(socAuthRaw);
        if (parsed?.state?.user && parsed?.state?.token) {
          const syncedUser: UserProfile = {
            id: parsed.state.user.id,
            name: parsed.state.user.name || parsed.state.user.username,
            username: parsed.state.user.username,
            role: parsed.state.user.role || 'SOC Analyst',
            token: parsed.state.token,
            isLoggedIn: true,
            loginTimestamp: Date.now(),
            sessionExpiresAt: Date.now() + 12 * 60 * 60 * 1000,
          };
          saveUserSession(syncedUser);
          return syncedUser;
        }
      }

      // Default jika belum login
      return {
        id: 0,
        name: '',
        username: '',
        role: '',
        isLoggedIn: false,
      };
    } catch {
      return {
        id: 0,
        name: '',
        username: '',
        role: '',
        isLoggedIn: false,
      };
    }
  });

  // Apps state with localStorage persistence and deleted app tracking
  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_APPS);
      const deletedIds = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);

      const saved = localStorage.getItem(STORAGE_KEYS.APPS);
      if (saved) {
        const parsed: AppItem[] = JSON.parse(saved);
        const updated = parsed.map((item) => {
          const initial = INITIAL_APPS.find((i) => i.id === item.id);
          if (initial && (item.id === 'sentinel-soc' || item.url !== initial.url || item.name !== initial.name)) {
            return { ...item, url: initial.url, name: initial.name, description: initial.description };
          }
          return item;
        });

        // Automatically append any newly added apps from INITIAL_APPS (excluding apps deleted by user)
        const existingIds = new Set(updated.map((a) => a.id));
        const newApps = INITIAL_APPS.filter((a) => !existingIds.has(a.id) && !deletedIds.has(a.id));
        return [...updated.filter((a) => !deletedIds.has(a.id)), ...newApps];
      }
      return INITIAL_APPS.filter((a) => !deletedIds.has(a.id));
    } catch {
      return INITIAL_APPS;
    }
  });

  // Activities state with localStorage persistence
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode) || 'grid';
  });
  const [sortOption, setSortOption] = useState<SortOption>('most-used');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<AppItem | null>(null);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEYS.THEME, String(isDarkMode));
  }, [isDarkMode]);

  // Sync apps to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
  }, [apps]);

  // Sync activities to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  // Save viewMode
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  // Periodic session validity check (every 30 seconds)
  useEffect(() => {
    if (!user.isLoggedIn) return;

    const interval = setInterval(() => {
      if (!isSessionValid(user)) {
        handleLogout();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // Login success handler
  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
  };

  // Logout handler
  const handleLogout = () => {
    terminateSession();
    setUser({
      id: 0,
      name: '',
      username: '',
      role: '',
      isLoggedIn: false,
    });
  };

  // Launch App handler
  const handleLaunchApp = (app: AppItem, newTab: boolean = true) => {
    const now = Date.now();
    setApps((prev) =>
      prev.map((item) =>
        item.id === app.id
          ? { ...item, launchCount: item.launchCount + 1, lastOpenedAt: now }
          : item
      )
    );

    const newActivity: ActivityLog = {
      id: 'act-' + now,
      appId: app.id,
      appName: app.name,
      category: app.category,
      iconName: app.iconName,
      accentColor: app.accentColor,
      timestamp: now,
    };
    setActivities((prev) => [newActivity, ...prev.filter((a) => a.appId !== app.id)].slice(0, 10));

    if (newTab) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = app.url;
    }
  };

  const handleLaunchById = (appId: string) => {
    const target = apps.find((a) => a.id === appId);
    if (target) handleLaunchApp(target, true);
  };

  const handleToggleFavorite = (appId: string) => {
    setApps((prev) =>
      prev.map((item) =>
        item.id === appId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleAddApp = (newApp: AppItem) => {
    setApps((prev) => [newApp, ...prev]);
  };

  const handleRequestDeleteApp = (app: AppItem) => {
    setAppToDelete(app);
  };

  const handleConfirmDeleteApp = (appId: string) => {
    // 1. Simpan ke daftar DELETED_APPS di localStorage
    try {
      const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_APPS);
      const deletedArr: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedArr.includes(appId)) {
        deletedArr.push(appId);
        localStorage.setItem(STORAGE_KEYS.DELETED_APPS, JSON.stringify(deletedArr));
      }
    } catch {
      // ignore
    }

    // 2. Filter dari state apps
    setApps((prev) => prev.filter((a) => a.id !== appId));

    // 3. Bersihkan dari recent activities jika ada
    setActivities((prev) => prev.filter((act) => act.appId !== appId));

    setAppToDelete(null);
  };

  const handleDeleteCustom = (appId: string) => {
    handleConfirmDeleteApp(appId);
  };

  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEYS.DELETED_APPS);
    localStorage.removeItem(STORAGE_KEYS.APPS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    setApps(INITIAL_APPS);
    setActivities(INITIAL_ACTIVITIES);
  };

  // Filtered & Sorted Apps
  const displayedApps = useMemo(() => {
    let result = [...apps];

    if (activeTab === 'favorites') {
      result = result.filter((a) => a.isFavorite);
    } else if (activeTab === 'recent') {
      const recentIds = activities.map((act) => act.appId);
      result = result.filter((a) => recentIds.includes(a.id));
    }

    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query) ||
          a.url.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'recent':
          return (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0);
        case 'most-used':
        default:
          return b.launchCount - a.launchCount;
      }
    });

    return result;
  }, [apps, activities, activeTab, selectedCategory, searchQuery, sortOption]);

  const counts = useMemo(() => {
    return {
      all: apps.length,
      security: apps.filter((a) => a.category === 'security').length,
      network: apps.filter((a) => a.category === 'network').length,
      monitoring: apps.filter((a) => a.category === 'monitoring').length,
      operations: apps.filter((a) => a.category === 'operations').length,
      favorites: apps.filter((a) => a.isFavorite).length,
    };
  }, [apps]);

  // Check if current URL is the login page or has a next parameter
  const isLoginRoute = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/login') ||
    Boolean(new URLSearchParams(window.location.search).get('next'))
  );
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const nextTarget = urlParams?.get('next');
  const reason = urlParams?.get('reason');

  // Handle expired/idle timeout query - clear stale session to require fresh login
  useEffect(() => {
    if (reason === 'expired' || reason === 'idle_timeout') {
      terminateSession();
      setUser({
        id: 0,
        name: '',
        username: '',
        role: '',
        isLoggedIn: false,
      });
    }
  }, [reason]);

  // Keep cookies fresh when authenticated
  useEffect(() => {
    if (user.isLoggedIn && isSessionValid(user)) {
      refreshAuthCookie();
    }
  }, [user]);

  // If on login route and session was expired, or not logged in, show LoginPage
  if (!user.isLoggedIn || !isSessionValid(user) || (isLoginRoute && (reason === 'expired' || reason === 'idle_timeout'))) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // If already authenticated and visiting /login?next=... (without expired reason), automatically redirect to target app!
  if (isLoginRoute && nextTarget && !reason) {
    if (nextTarget.startsWith('/') && !nextTarget.startsWith('//') && !nextTarget.startsWith('/login')) {
      refreshAuthCookie();
      saveUserSession(user);
      window.location.replace(nextTarget);
      return null;
    }
  }

  // Once authenticated, render the full Clipan Portal Dashboard
  return (
    <div className="portal-layout">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'favorites') setSelectedCategory('all');
          if (tab === 'recent') setSelectedCategory('all');
        }}
        appsCount={apps.length}
        favoritesCount={counts.favorites}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* 2. Main Content & Right Sidebar Wrapper */}
      <div className="portal-main-wrapper">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          user={user}
          onOpenLogin={() => {}}
          onLogout={handleLogout}
        />

        <div className="portal-body">
          {/* Main Content Area */}
          <main className="portal-content">
            {/* Hero Banner (Only shown on 'home' tab) */}
            {activeTab === 'home' && !searchQuery && (
              <HeroBanner
                onExplore={() => {
                  const el = document.getElementById('apps-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onManage={() => setIsAddModalOpen(true)}
              />
            )}

            {/* Section Header & Toolbar */}
            <div id="apps-section" className="toolbar-container">
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {activeTab === 'favorites' ? 'Your Favorite Apps' : activeTab === 'recent' ? 'Recently Used Apps' : 'Your Apps'}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Showing {displayedApps.length} active applications & telemetry consoles
                </p>
              </div>

              {/* Controls: Grid/List Toggle & Sort Dropdown */}
              <div className="controls-group">
                <div className="view-toggle">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    title="Grid view"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    title="List view"
                  >
                    <List size={16} />
                  </button>
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="sort-select"
                >
                  <option value="most-used">Sort: Most Used</option>
                  <option value="name-asc">Sort: Name (A-Z)</option>
                  <option value="name-desc">Sort: Name (Z-A)</option>
                  <option value="category">Sort: Category</option>
                  <option value="recent">Sort: Recently Opened</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="filter-tabs" style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                <span>All Apps</span>
                <span className="tab-counter">{counts.all}</span>
              </button>

              <button
                onClick={() => setSelectedCategory('security')}
                className={`tab-btn ${selectedCategory === 'security' ? 'active' : ''}`}
              >
                <span>Security (SOC)</span>
                <span className="tab-counter">{counts.security}</span>
              </button>

              <button
                onClick={() => setSelectedCategory('network')}
                className={`tab-btn ${selectedCategory === 'network' ? 'active' : ''}`}
              >
                <span>Network (NOC)</span>
                <span className="tab-counter">{counts.network}</span>
              </button>

              <button
                onClick={() => setSelectedCategory('monitoring')}
                className={`tab-btn ${selectedCategory === 'monitoring' ? 'active' : ''}`}
              >
                <span>Monitoring</span>
                <span className="tab-counter">{counts.monitoring}</span>
              </button>

              <button
                onClick={() => setSelectedCategory('operations')}
                className={`tab-btn ${selectedCategory === 'operations' ? 'active' : ''}`}
              >
                <span>Operations & IT</span>
                <span className="tab-counter">{counts.operations}</span>
              </button>
            </div>

            {/* Apps Display: Grid or List */}
            {displayedApps.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="apps-grid">
                  {displayedApps.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onLaunch={handleLaunchApp}
                      onToggleFavorite={handleToggleFavorite}
                      onDeleteApp={handleRequestDeleteApp}
                      onDeleteCustom={handleDeleteCustom}
                    />
                  ))}

                  {/* "Add New App" Card */}
                  <div
                    onClick={() => setIsAddModalOpen(true)}
                    className="add-app-card"
                  >
                    <div className="add-app-icon">
                      <Plus size={22} />
                    </div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Add New App
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      Integrate or register any custom internal web app
                    </p>
                  </div>
                </div>
              ) : (
                <AppListView
                  apps={displayedApps}
                  onLaunch={handleLaunchApp}
                  onToggleFavorite={handleToggleFavorite}
                  onDeleteApp={handleRequestDeleteApp}
                />
              )
            ) : (
              <div 
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px dashed var(--border-card)',
                  borderRadius: 'var(--radius-xl)',
                  margin: '20px 0',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--accent-primary)' }}>
                  <Search size={24} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  No applications found
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  No apps matched &ldquo;{searchQuery}&rdquo;. Try another keyword or clear filters.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setActiveTab('home');
                  }}
                  className="btn-primary"
                  style={{ fontSize: '12.5px', padding: '8px 18px' }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>

          {/* 3. Right Sidebar */}
          <RightSidebar
            apps={apps}
            activities={activities}
            onLaunchApp={handleLaunchById}
            onOpenHelp={() => setIsHelpOpen(true)}
            onViewAllFavorites={() => {
              setActiveTab('favorites');
              setSelectedCategory('all');
            }}
            onViewAllRecent={() => {
              setActiveTab('recent');
              setSelectedCategory('all');
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <AddAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApp={handleAddApp}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={handleResetData}
      />

      <ConfirmDeleteModal
        isOpen={!!appToDelete}
        app={appToDelete}
        onClose={() => setAppToDelete(null)}
        onConfirm={handleConfirmDeleteApp}
      />
    </div>
  );
}
