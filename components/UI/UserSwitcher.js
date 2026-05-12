'use client';

import { useUser } from '@/lib/UserContext';
import { USERS }   from '@/lib/api';
import styles      from './UserSwitcher.module.css';

export default function UserSwitcher() {
  const { userId, switchUser } = useUser();

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>User:</span>
      {Object.values(USERS).map((u) => (
        <button
          key={u.id}
          className={`${styles.btn} ${userId === u.id ? styles.active : ''}`}
          onClick={() => switchUser(u.id)}
          title={u.description}
        >
          {userId === u.id && <span className={styles.dot} />}
          {u.id} — {u.id === 'u1' ? 'Empty' : 'Active'}
        </button>
      ))}
    </div>
  );
}