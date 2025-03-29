import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ServiceProviderCard from '@/components/common/ServiceProviderCard';
import { categories, serviceProviders } from '@/lib/data';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  // Show only 4 featured providers
  const featuredProviders = serviceProviders.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      {/* <section className="relative bg-muted py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Find Expert Service Providers in Your Area
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Connect with skilled professionals for moving, landscaping,
                  roofing, and more. Get personalized quotes and hire with confidence.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <div className="relative flex-1">
                  <Input
                    type="search"
                    placeholder="What service do you need?"
                    className="w-full bg-background pl-8"
                  />
                </div>
                <Link href="/marketplace">
                  <Button className="w-full min-[400px]:w-auto">
                    Search
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-end">
              <Image
                src="https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=600&auto=format&fit=crop"
                alt="Hero Image"
                width={500}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section> */}
      <HeroSection />

      {/* Categories section */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
              <p className="text-muted-foreground">
                Browse service providers by category
              </p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline" className="gap-1">
                View all categories
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/marketplace?category=${category.id}`}
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
      </section>

      {/* Featured service providers section */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Featured Service Providers
              </h2>
              <p className="text-muted-foreground">
                Top-rated professionals ready to help
              </p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredProviders.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                serviceProvider={provider}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="bg-muted py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              Find and hire service providers in just a few simple steps
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="mt-4 text-lg font-medium">Search</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse categories or search for the specific service you need
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="mt-4 text-lg font-medium">Connect</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Message providers directly to discuss your project needs
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="mt-4 text-lg font-medium">Hire</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Book services with confidence knowing you've found the right pro
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="rounded-lg bg-primary/10 p-6 md:p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Ready to get started?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Find skilled professionals for your project today. Join thousands
              of satisfied customers who have found their perfect service
              provider match.
            </p>
            <div className="mt-6 flex flex-col gap-2 min-[400px]:flex-row">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-background"
              />
              <Button className="w-full min-[400px]:w-auto">Get Started</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
