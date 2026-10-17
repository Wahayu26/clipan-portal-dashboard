import type { UserProfile } from '../types';

const STORAGE_KEYS = {
  USER: 'clipan_portal_user',
  LOCKOUT: 'clipan_portal_sec_lockout',
  AUTH_COOKIE: 'soc_auth',
};

// Security Config
export const SECURITY_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  WARNING_THRESHOLD: 3,
  LOCKOUT_DURATION_MS: 60 * 1000, // 60 seconds lockout on 5 failed attempts
  SESSION_DURATION_MS: 12 * 60 * 60 * 1000, // 12 hours active session
  REMEMBER_SESSION_DURATION_MS: 7 * 24 * 60 * 60 * 1000, // 7 days if remember me checked
};

export interface LockoutState {
  failedAttempts: number;
  lockoutUntil: number | null;
  lastAttemptAt: number | null;
}

/**
 * Retrieve current brute-force protection state from localStorage
 */
export function getLockoutState(): LockoutState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCKOUT);
    if (!raw) return { failedAttempts: 0, lockoutUntil: null, lastAttemptAt: null };
    const parsed: LockoutState = JSON.parse(raw);

    // Auto clear if lockout duration has passed
    if (parsed.lockoutUntil && Date.now() > parsed.lockoutUntil) {
      resetLockoutState();
      return { failedAttempts: 0, lockoutUntil: null, lastAttemptAt: null };
    }

    return parsed;
  } catch {
    return { failedAttempts: 0, lockoutUntil: null, lastAttemptAt: null };
  }
}

/**
 * Check if the user is currently locked out due to too many failed attempts
 */
export function checkIsLockedOut(): { locked: boolean; secondsRemaining: number; attemptsLeft: number } {
  const state = getLockoutState();
  const now = Date.now();

  if (state.lockoutUntil && state.lockoutUntil > now) {
    const secondsRemaining = Math.ceil((state.lockoutUntil - now) / 1000);
    return { locked: true, secondsRemaining, attemptsLeft: 0 };
  }

  const attemptsLeft = Math.max(0, SECURITY_CONFIG.MAX_FAILED_ATTEMPTS - state.failedAttempts);
  return { locked: false, secondsRemaining: 0, attemptsLeft };
}

/**
 * Record a failed login attempt and apply progressive cooldown
 */
export function recordFailedAttempt(): { locked: boolean; secondsRemaining: number; attemptsLeft: number } {
  const current = getLockoutState();
  const now = Date.now();
  const newAttempts = current.failedAttempts + 1;

  let lockoutUntil: number | null = null;
  let locked = false;
  let secondsRemaining = 0;

  if (newAttempts >= SECURITY_CONFIG.MAX_FAILED_ATTEMPTS) {
    lockoutUntil = now + SECURITY_CONFIG.LOCKOUT_DURATION_MS;
    locked = true;
    secondsRemaining = Math.ceil(SECURITY_CONFIG.LOCKOUT_DURATION_MS / 1000);
  }

  const updated: LockoutState = {
    failedAttempts: newAttempts,
    lockoutUntil,
    lastAttemptAt: now,
  };

  localStorage.setItem(STORAGE_KEYS.LOCKOUT, JSON.stringify(updated));
  const attemptsLeft = Math.max(0, SECURITY_CONFIG.MAX_FAILED_ATTEMPTS - newAttempts);

  return { locked, secondsRemaining, attemptsLeft };
}

/**
 * Reset lockout state upon successful authentication
 */
export function resetLockoutState(): void {
  localStorage.removeItem(STORAGE_KEYS.LOCKOUT);
}

/**
 * Validate if an active user session exists and is unexpired
 */
export function isSessionValid(user: UserProfile | null): boolean {
  if (!user || !user.isLoggedIn) return false;
  if (!user.sessionExpiresAt) return false;
  return Date.now() < user.sessionExpiresAt;
}

/**
 * Persist secure session to storage and cookies
 */
export function saveUserSession(user: UserProfile, rememberMe: boolean = false): void {
  const now = Date.now();
  const duration = rememberMe 
    ? SECURITY_CONFIG.REMEMBER_SESSION_DURATION_MS 
    : SECURITY_CONFIG.SESSION_DURATION_MS;
    
  const sessionUser: UserProfile = {
    ...user,
    isLoggedIn: true,
    loginTimestamp: now,
    sessionExpiresAt: now + duration,
  };

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));

  // Set companion authentication flag cookie for proxy alignment
  const maxAgeSec = Math.floor(duration / 1000);
  document.cookie = `soc_auth=1; path=/; max-age=${maxAgeSec}; SameSite=Lax; Secure`;
  document.cookie = `portal_session=active; path=/; max-age=${maxAgeSec}; SameSite=Lax; Secure`;

  resetLockoutState();
}

/**
 * Terminate session and remove all auth artifacts
 */
export function terminateSession(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem('soc-auth');
  document.cookie = 'soc_auth=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'portal_session=; path=/; max-age=0; SameSite=Lax';
}
