'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { useUser } from '@/lib/UserContext';

/**
 * Generic data-fetching hook tied to the active userId.
 * Re-fetches automatically when userId changes.
 *
 * @param {string} endpoint  - e.g. '/api/auth/profile'
 * @returns {{ data, loading, error, refetch }}
 */
export function useApiData(endpoint) {
  const { userId } = useUser();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch(endpoint, userId);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
