"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useSession } from "@/hooks/use-session";

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
  redirectTo = "/login",
  checkFunction,
}: ProtectedRouteProps) {
  const router = useRouter();
  // const { user, isLoading } = useAuthStore();
  const { data, isPending: isLoading } = useSession();
  const user = data?.user;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const role = user?.role;

  console.log("user : ", role);

  useEffect(() => {
    if (isLoading) return;

    // Handle basic auth condition
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Handle guest condition
    if (requireGuest && user) {
      router.push("/");
      return;
    }
    // Handle role condition
    if (requireRole.length > 0 && user && !requireRole.includes(role)) {
      router.push("/");
      return;
    }

    // Handle custom check function
    if (checkFunction && !checkFunction()) {
      // router.push(redirectTo);
      return;
    }
  }, [isLoading, user, requireAuth, requireGuest, requireRole, redirectTo, router, checkFunction]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render children only when conditions are met
  if (
    (requireAuth && !user) ||
    (requireGuest && user) ||
    (requireRole.length > 0 && user && !requireRole.includes(role)) ||
    (checkFunction && !checkFunction())
  ) {
    return null;
  }

  return <>{children}</>;
}
