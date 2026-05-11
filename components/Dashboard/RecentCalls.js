'use client';

import { useApiData } from '@/hooks/useApiData';
import { groupSessionsByDate, formatCallTime } from '@/lib/api';
import styles from './RecentCalls.module.css';

function getInitials(name) {
  if (!name) return 'C';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    '#6c63ff', '#3b82f6', '#22c55e',
    '#f59e0b', '#ef4444', '#8b5cf6',
  ];
  if (!name) return colors[0];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function SkeletonRow() {
  return (
    <div className={styles.skeletonRow}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonName} />
        <div className={styles.skeletonDesc} />
      </div>
      <div className={styles.skeletonTime} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.9 1.18 2 2 0 012.92 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
        </svg>
      </div>
      <p className={styles.emptyTitle}>No Recent Calls</p>
      <p className={styles.emptyDesc}>
        Connect your Google Calendar to see upcoming meetings, get reminders, and join calls directly from Hintro.
      </p>
      <button className={styles.emptyBtn}>Start a Call</button>
    </div>
  );
}

export default function RecentCalls() {
  const { data, loading } = useApiData('/api/call-sessions?limit=10');

  if (loading) {
    return (
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Recent calls</p>
        <div className={styles.group}>
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  const sessions = data?.callSessions ?? [];

  if (sessions.length === 0) {
    return (
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Recent calls</p>
        <EmptyState />
      </div>
    );
  }

  const grouped = groupSessionsByDate(sessions);

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Recent calls</p>

      {grouped.map(({ date, items }) => (
        <div key={date} className={styles.group}>
          <p className={styles.dateLabel}>{date}</p>

          {items.map((session) => {
            const clientName = session.client || 'Unknown Client';
            const initials   = getInitials(clientName);
            const avatarBg   = getAvatarColor(clientName);
            const time       = formatCallTime(session.started_at || session.createdAt);

            return (
              <div key={session._id} className={styles.callRow}>
                <div
                  className={styles.callAvatar}
                  style={{ background: avatarBg }}
                >
                  {initials}
                </div>

                <div className={styles.callInfo}>
                  <p className={styles.callName}>{clientName}</p>
                  <p className={styles.callDesc}>{session.description || '···'}</p>
                </div>

                <span className={styles.callTime}>{time}</span>

                <button className={styles.menuBtn} aria-label="More options">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5"  r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}