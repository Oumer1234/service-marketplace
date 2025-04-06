import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ServiceProviderCard from "@/components/common/ServiceProviderCard";
import { serviceProviders } from "@/lib/data";
import HeroSection from "@/components/Homepage/HeroSection";
import HowItWorks from "@/components/Homepage/HowItWorks";
import CTASection from "@/components/Homepage/CTASection";
import CategoriesSection from "@/components/Homepage/CategoriesSection";
import AboutSection from "@/components/Homepage/AboutSection";

export default function Home() {
  // Show only 4 featured providers
  const featuredProviders = serviceProviders.slice(0, 4);

  return (
    <div className="overflow-clip">
      <HeroSection />
      <AboutSection />
      {/* <CategoriesSection /> */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Service Providers</h2>
              <p className="text-muted-foreground">Top-rated professionals ready to help</p>
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
              <ServiceProviderCard key={provider.id} serviceProvider={provider} />
            ))}
          </div>
        </div>
      </section>
      <HowItWorks />
      <CTASection />
    </div>
  );
}
