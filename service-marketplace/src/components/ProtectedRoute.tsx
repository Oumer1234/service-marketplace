'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  requireRole?: string[];
  redirectTo?: string;
  checkFunction?: () => boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireGuest = false,
  requireRole = [],
  redirectTo = '/login',
  checkFunction,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    // Handle basic auth condition
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Handle guest condition
    if (requireGuest && user) {
      router.push('/');
      return;
    }

    // Handle role condition
    if (requireRole.length > 0 && user && !requireRole.includes(user.role)) {
      router.push('/');
      return;
    }

    // Handle custom check function
    if (checkFunction && !checkFunction()) {
      router.push(redirectTo);
      return;
    }
  }, [isLoading, user, requireAuth, requireGuest, requireRole, redirectTo, router, checkFunction]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render children only when conditions are met
  if (
    (requireAuth && !user) ||
    (requireGuest && user) ||
    (requireRole.length > 0 && user && !requireRole.includes(user.role)) ||
    (checkFunction && !checkFunction())
  ) {
    return null;
  }

  return <>{children}</>;
}
