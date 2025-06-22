"use client";

import { useSession } from "@/hooks/use-session";
import { Loader2 } from "lucide-react";
import ServiceProviderDashboard from "@/components/dashboard/ServiceProviderDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  const { user } = session;
  console.log(user.role, "ROLE");
  return (
    <div className="mt-20">
      {user.role === "service_provider" && <ServiceProviderDashboard />}
      {user.role === "user" && <UserDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </div>
  );
}
