'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check for authentication when the app loads
    const initAuth = async () => {
      await checkAuth();
    };

    initAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
