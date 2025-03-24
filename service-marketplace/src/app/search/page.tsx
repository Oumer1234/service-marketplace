import Link from 'next/link';
import { ArrowLeft, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SearchPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="bg-muted py-8">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/marketplace">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to marketplace</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Search</h1>
          </div>

          <form action="/search" className="mt-4 max-w-2xl">
            <div className="relative">
              <Input
                type="search"
                name="q"
                placeholder="Search services, providers, or locations..."
                className="w-full bg-background pl-8 pr-12"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container px-4 py-8 md:px-6">
        <div className="rounded-lg border py-16 text-center">
          <Grid3X3 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Search for Services</h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Enter a keyword above to search for service providers by name, location, or service type.
          </p>
          <Link href="/marketplace">
            <Button className="mt-6">
              Browse All Providers
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
