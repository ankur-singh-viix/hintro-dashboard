// ─── API Configuration ───────────────────────────────────────────
export const API_BASE_URL = 'https://mock-backend-hintro.vercel.app';

export const USERS = {
  u1: { id: 'u1', label: 'John Doe', description: 'New user (empty state)' },
  u2: { id: 'u2', label: 'Om',       description: 'Active user (with data)' },
};

export const DEFAULT_USER = 'u2';

// ─── API Fetcher ─────────────────────────────────────────────────
export async function apiFetch(endpoint, userId) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'x-user-id': userId,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0 }, // always fresh
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${endpoint}`);
  }

  return res.json();
}

// ─── Time Formatting Helpers ─────────────────────────────────────

/**
 * Formats seconds into "Xm Ysec" style as shown in Figma.
 * e.g. 2211 → "36m 51sec" ; 862 → "14m 22sec"
 */
export function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0';

  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  if (mins === 0) return `${secs}sec`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}sec`;
}

/**
 * Returns "X days ago", "Today", "Yesterday" relative to now.
 */
export function timeAgo(dateString) {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const now  = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7)   return `${diff} days ago`;
  if (diff < 30)  return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

/**
 * Returns "Apr 29th" style date label from ISO string.
 */
export function formatCallDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day   = date.getDate();

  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' :
    day % 10 === 2 && day !== 12 ? 'nd' :
    day % 10 === 3 && day !== 13 ? 'rd' : 'th';

  return `${month} ${day}${suffix}`;
}

/**
 * Returns "11:00 am" style time string.
 */
export function formatCallTime(dateString) {
  if (!dateString) return '';

  return new Date(dateString).toLocaleTimeString('en-US', {
    hour:   'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

/**
 * Groups call sessions by date label for the Recent Calls list.
 */
export function groupSessionsByDate(sessions) {
  const groups = {};

  sessions.forEach((session) => {
    const label = formatCallDate(session.started_at || session.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(session);
  });

  return Object.entries(groups).map(([date, items]) => ({ date, items }));
}

/**
 * Gets last session display string from lastSession array.
 * Returns "2 days ago" style.
 */
export function getLastSessionLabel(lastSessionArr) {
  if (!lastSessionArr || lastSessionArr.length === 0) return '-';
  return timeAgo(lastSessionArr[0]);
}
