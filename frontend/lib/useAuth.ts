'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from './store';

export function useAuth() {
  const { user, token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isAuthenticated = isHydrated && !!user && !!token;

  return {
    isAuthenticated,
    user,
    token,
    isHydrated,
  };
}
