'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header  from './Header';
import styles  from './DashboardLayout.module.css';

export default function DashboardLayout({ children, onLogoutClick, onFeedbackOpen, onFeedbackHistoryOpen }) {
  const [activeItem,  setActiveItem]  = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar
        activeItem={activeItem}
        onNavigate={setActiveItem}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onFeedbackOpen={onFeedbackOpen}
        onFeedbackHistoryOpen={onFeedbackHistoryOpen}
      />
      <div className={styles.main}>
        <Header
          pageTitle="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
          onLogoutClick={onLogoutClick}
        />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}