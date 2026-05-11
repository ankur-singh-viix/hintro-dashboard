'use client';

import { useApiData } from '@/hooks/useApiData';
import { formatDuration, getLastSessionLabel } from '@/lib/api';
import styles from './StatsCards.module.css';

const CARDS = [
  {
    key: 'sessions',
    label: 'Total Sessions',
    iconClass: 'sessions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.9 1.18 2 2 0 012.92 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
      </svg>
    ),
  },
  {
    key: 'duration',
    label: 'Average Duration',
    iconClass: 'duration',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: 'ai',
    label: 'AI Used',
    iconClass: 'ai',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 110-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z" />
        <path d="M9 14a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
    ),
  },
  {
    key: 'last',
    label: 'Last Session',
    iconClass: 'last',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8"  y1="2" x2="8"  y2="6" />
        <line x1="3"  y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonIcon} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonLabel} />
        <div className={styles.skeletonValue} />
      </div>
    </div>
  );
}

export default function StatsCards() {
  const { data, loading, error } = useApiData('/api/call-sessions/stats');

  const getValue = (key) => {
    if (!data) return '0';
    switch (key) {
      case 'sessions': return data.totalSessions ?? 0;
      case 'duration': return data.averageDuration ? formatDuration(data.averageDuration) : '0';
      case 'ai':       return data.totalAIInteractions ? `${data.totalAIInteractions} times` : '0';
      case 'last':     return getLastSessionLabel(data.lastSession);
      default:         return '0';
    }
  };

  if (loading) {
    return (
      <div className={styles.grid}>
        {CARDS.map((c) => <SkeletonCard key={c.key} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.grid}>
        {CARDS.map((c) => (
          <div key={c.key} className={styles.card}>
            <div className={`${styles.iconWrap} ${styles[c.iconClass]}`}>{c.icon}</div>
            <div className={styles.info}>
              <span className={styles.label}>{c.label}</span>
              <span className={styles.value}>—</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {CARDS.map((c) => (
        <div key={c.key} className={styles.card}>
          <div className={`${styles.iconWrap} ${styles[c.iconClass]}`}>{c.icon}</div>
          <div className={styles.info}>
            <span className={styles.label}>{c.label}</span>
            <span className={styles.value}>{getValue(c.key)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}