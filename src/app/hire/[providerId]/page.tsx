import HirePageClient from "./HirePageClient";
import type { ServiceProvider } from "@/types";

async function fetchProvider(providerId: string): Promise<ServiceProvider | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/service-providers/${providerId}`, {
    cache: "no-store", // Ensure fresh data
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function HirePage({ params }: { params: { providerId: string } }) {
  const { providerId } = params;
  const provider = await fetchProvider(providerId);

  if (!provider) {
    return (
      <div className="flex justify-center items-center text-center mt-20 h-screen text-red-500">
        Provider not found or an error occurred.
      </div>
    );
  }

  return <HirePageClient provider={provider} providerId={providerId} />;
}
