import Link from 'next/link';
import { Container } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceProviderCard from '@/components/common/ServiceProviderCard';
import { serviceProviders, categories } from '@/lib/data';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="bg-muted py-8">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Service Providers</h1>
          <p className="text-muted-foreground">
            Find the perfect professional for your project
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/marketplace">
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-1"
              >
                All
              </Button>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/marketplace?category=${category.id}`}
                prefetch={false}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {serviceProviders.length} service providers
                </h2>
              </div>

              <div className="flex items-center gap-1 border rounded-md p-1 mt-4 sm:mt-0">
                <Link href="/marketplace">
                  <Button
                    variant="default"
                    size="icon"
                    className="h-8 w-8 rounded-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span className="sr-only">Grid view</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {serviceProviders.map((provider) => (
                <ServiceProviderCard
                  key={provider.id}
                  serviceProvider={provider}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
