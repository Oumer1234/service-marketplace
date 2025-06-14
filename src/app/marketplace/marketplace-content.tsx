"use client";
import Link from "next/link";
import { Container, Grid2X2, List, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceProviderCard from "@/components/common/ServiceProviderCard";
import { categories } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ServiceProvider } from "@/types";

type sortByType = "Popularity" | "Price" | "Rate" | "Alphabet";
type viewType = "grid" | "list";

export default function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<sortByType>("Popularity");
  const [viewType, setViewType] = useState<viewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServiceProviders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
        sortBy: sortBy.toLowerCase(),
        ...(searchQuery && { search: searchQuery }),
        ...(searchParams.get("category") && { category: searchParams.get("category")! }),
      });

      const response = await fetch(`/api/service-providers?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch service providers");
      }

      const data = await response.json();
      setServiceProviders(data.serviceProviders);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, searchQuery, searchParams.get("category")]);

  const handleSortChange = (sort: sortByType) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleViewChange = (view: viewType) => {
    setViewType(view);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchServiceProviders();
  };

  return (
    <div className="min-h-screen pb-12 mt-16">
      <div className="bg-muted py-20">
        <div className="container px-4 md:px-6 flex items-center justify-between flex-col gap-2 text-center">
          <h1 className="text-5xl font-poppins font-extrabold tracking-tight mb-4">
            Connect with Trusted Service Providers You'll Love{" "}
          </h1>
          <p className="text-muted-foreground text-lg max-w-4xl">
            Discover reliable and skilled professionals tailored to your needs. Whether it's home
            repairs, design work, or anything in between. we've got the right people for the
            job.{" "}
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
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-0 rounded-l-md top-1/2 transform -translate-y-1/2 bg-muted h-full p-3 pt-2">
                  <SearchIcon className="size-5" />
                </div>
              </form>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <p className="font-semibold">Sort by : </p>
                <ul className="flex items-center gap-3">
                  {["Popularity", "Price", "Rate", "Alphabet"].map((sort) => (
                    <li
                      key={sort}
                      className={`py-2 px-2 cursor-pointer hover:bg-muted-foreground/20 rounded-md ${
                        sortBy === sort ? "font-bold bg-muted-foreground/20" : ""
                      }`}
                      onClick={() => handleSortChange(sort as sortByType)}
                    >
                      {sort}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-3 border rounded-md p-1 mt-4 sm:mt-0">
                <Button
                  variant={viewType === "grid" ? "default" : "outline"}
                  size="icon"
                  className="border-none rounded-sm"
                  onClick={() => handleViewChange("grid")}
                >
                  <Grid2X2 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={viewType === "list" ? "default" : "outline"}
                  size="icon"
                  className="border-none rounded-sm"
                  onClick={() => handleViewChange("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${viewType === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {serviceProviders.map((provider) => (
                  <ServiceProviderCard key={provider.id} serviceProvider={provider} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
