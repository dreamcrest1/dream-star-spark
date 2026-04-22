// Hardcoded admin password (per user choice — note: client-side only, not secure).
// Change this value to set your own password.
export const ADMIN_PASSWORD = 'dreamstar2024';

const KEY = 'dss_admin_session';

export function loginAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(KEY, '1');
    return true;
  }
  return false;
}

export function isAdmin(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem(KEY);
}
