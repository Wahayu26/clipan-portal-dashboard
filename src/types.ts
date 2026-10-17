export type AppCategory = 'security' | 'network' | 'monitoring' | 'operations' | 'other';

export interface AppItem {
  id: string;
  name: string;
  description: string;
  url: string;
  category: AppCategory;
  iconName: string;
  badge?: string;
  accentColor: string; // e.g. '#6366f1' or hex
  bgGradient: string; // e.g. 'linear-gradient(135deg, #6366f1, #4f46e5)'
  status: 'online' | 'maintenance' | 'offline';
  isFavorite?: boolean;
  isCustom?: boolean;
  launchCount: number;
  lastOpenedAt?: number; // timestamp
}

export interface ActivityLog {
  id: string;
  appId: string;
  appName: string;
  category: AppCategory;
  iconName: string;
  accentColor: string;
  timestamp: number;
}

export interface UserProfile {
  id?: number;
  name: string;
  username: string;
  role?: string;
  token?: string;
  isLoggedIn: boolean;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name-asc' | 'name-desc' | 'category' | 'most-used' | 'recent';
export type ActiveTab = 'home' | 'all' | 'favorites' | 'recent' | 'categories';
