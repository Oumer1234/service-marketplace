import Link from "next/link";
import { Container, Grid2X2, List, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceProviderCard from "@/components/common/ServiceProviderCard";
import { serviceProviders, categories } from "@/lib/data";
import { Input } from "@/components/ui/input";

export default function MarketplacePage() {
  console.log(serviceProviders);

  return (
    <div className="min-h-screen pb-12 mt-16">
      <div className="bg-muted py-20">
        <div className="container px-4 md:px-6 flex items-center justify-between flex-col gap-2 text-center">
          <h1 className="text-5xl font-poppins font-extrabold tracking-tight mb-4">
            Connect with Trusted Service Providers You'll Love{" "}
          </h1>
          <p className="text-muted-foreground text-lg max-w-4xl">
            Discover reliable and skilled professionals tailored to your needs. Whether it's home
            repairs, design work, or anything in between. we've got the right people for the job.{" "}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/marketplace">
              <Button
                variant="outline"
                size="sm"
                className="py-5 px-5 text-md font-normal text-muted-foreground rounded-full"
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
                  className="py-5 px-6 gap-3 text-md font-normal text-muted-foreground rounded-full"
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 md:px-6">
        {/* Main content */}
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">All Service Providers</h2>
              <div className="relative">
                <Input type="text" placeholder="Search..." className="w-full pl-12" />
                <div className="absolute left-0 rounded-l-md top-1/2 transform -translate-y-1/2 bg-muted h-full p-3 pt-2">
                  <SearchIcon className=" size-5  " />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <p className="font-semibold">Sort by : </p>
                <ul className="flex items-center gap-3">
                  <li className="font-bold bg-muted-foreground/20 py-2 px-2 cursor-pointer hover:bg-muted-foreground/20 rounded-md">
                    Popularity
                  </li>
                  <li className=" py-2 px-2 cursor-pointer hover:bg-muted-foreground/20 rounded-md">
                    Price
                  </li>
                  <li className=" py-2 px-2 cursor-pointer hover:bg-muted-foreground/20 rounded-md">
                    Rate
                  </li>
                  <li className=" py-2 px-2 cursor-pointer hover:bg-muted-foreground/20 rounded-md">
                    Alphabet
                  </li>
                </ul>
              </div>
              <div className="flex items-center gap-3 border rounded-md p-1 mt-4 sm:mt-0">
                <Button variant="default" size="icon" className="border-none rounded-sm">
                  <Grid2X2 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button variant="outline" size="icon" className="border-none rounded-sm">
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceProviders.map((provider) => (
              <ServiceProviderCard key={provider.id} serviceProvider={provider} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
