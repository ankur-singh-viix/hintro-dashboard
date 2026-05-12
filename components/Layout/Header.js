'use client';

import { useState, useRef, useEffect } from 'react';
import styles      from './Header.module.css';
import { useUser } from '@/lib/UserContext';
import UserSwitcher from '@/components/UI/UserSwitcher';

export default function Header({ pageTitle = 'Dashboard', onMenuClick, onLogoutClick }) {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.label
    ? user.label.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className={styles.header}>
      {/* Left */}
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className={styles.right}>

        {/* User switcher — for reviewer to toggle u1/u2 */}
        <div className={styles.switcherWrap}>
          <UserSwitcher />
        </div>

        {/* Watch Tutorial */}
        <button className={styles.watchTutorialBtn}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Watch Tutorial</span>
        </button>

        {/* Avatar + dropdown */}
        <div className={styles.avatarWrapper} ref={dropdownRef}>
          <button
            className={styles.avatarBtn}
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="User menu"
          >
            <div className={styles.avatar}>{initials}</div>
            <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <button
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </button>
              <div className={styles.dropdownDivider} />
              <button
                className={`${styles.dropdownItem} ${styles.danger}`}
                onClick={() => { setDropdownOpen(false); onLogoutClick?.(); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}