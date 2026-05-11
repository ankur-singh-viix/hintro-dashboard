'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatsCards      from '@/components/Dashboard/StatsCards';
import { useUser }     from '@/lib/UserContext';
import styles          from './page.module.css';

export default function DashboardPage() {
  const { user } = useUser();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <DashboardLayout
      onLogoutClick={() => setLogoutOpen(true)}
      onFeedbackOpen={() => {}}
      onFeedbackHistoryOpen={() => {}}
    >
      <div className={styles.page}>
        {/* Welcome banner */}
        <div className={styles.welcome}>
          <div className={styles.welcomeText}>
            <h2>Hi, {user?.label} 👋 Welcome to Hintro</h2>
            <p>Ready to make your next call smarter?</p>
          </div>
          <button className={styles.startCallBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.9 1.18 2 2 0 012.92 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
            </svg>
            Start New Call
          </button>
        </div>

        {/* Stats Cards — live API */}
        <StatsCards />

        {/* Recent Calls — coming Step 4 */}
      </div>

      {/* Logout placeholder */}
      {logoutOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'14px', textAlign:'center', fontFamily:'var(--font-sans)' }}>
            <p style={{ marginBottom:'1rem' }}>Logout modal — coming Step 6</p>
            <button onClick={() => setLogoutOpen(false)} style={{ padding:'0.5rem 1.5rem', background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}