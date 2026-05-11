'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_USER, USERS } from '@/lib/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(DEFAULT_USER);

  // Persist user selection across page refreshes
  useEffect(() => {
    const saved = localStorage.getItem('hintro_active_user');
    if (saved && USERS[saved]) setUserId(saved);
  }, []);

  const switchUser = (id) => {
    if (!USERS[id]) return;
    setUserId(id);
    localStorage.setItem('hintro_active_user', id);
  };

  return (
    <UserContext.Provider value={{ userId, switchUser, user: USERS[userId] }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}
