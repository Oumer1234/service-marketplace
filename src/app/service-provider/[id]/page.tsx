import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Clock, ChevronLeft, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/common/StarRating";
import PortfolioGallery from "@/components/service-provider/PortfolioGallery";
import ReviewList from "@/components/service-provider/ReviewList";
import ServicesOffered from "@/components/service-provider/ServicesOffered";
import { ServiceProvider, Review } from "@/types";
import getUserSession from "@/hooks/use-get-user-session";

interface ServiceProviderDetailPageProps {
  params: {
    id: string;
  };
}

async function getServiceProvider(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-providers/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch service provider");
  }

  return res.json();
}

export default async function ServiceProviderDetailPage({
  params,
}: ServiceProviderDetailPageProps) {
  const { id } = await params;
  const session = await getUserSession();

  console.log("Server Session : ", session);

  let serviceProvider;
  try {
    serviceProvider = await getServiceProvider(id);
  } catch (error) {
    return (
      <div className="container px-4 py-12 md:px-6 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Service Provider Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The service provider you are looking for does not exist or has been removed.
        </p>
        <Link href="/marketplace">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Cover Image */}
      <div className="relative h-48 w-full md:h-64 lg:h-80">
        <Image
          src={serviceProvider.coverImage || "/images/default-cover.jpg"}
          alt={`${serviceProvider.name} cover`}
          fill
          priority
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="container px-4 relative -mt-16 md:px-6">
        <div className="rounded-lg bg-background p-4 shadow-sm md:p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-background">
              <AvatarImage src={serviceProvider.profileImage} alt={serviceProvider.name} />
              <AvatarFallback className="text-2xl">
                {serviceProvider.name
                  .split(" ")
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((n: any[]) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">{serviceProvider.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={serviceProvider.rating} showValue size="lg" />
                    <span className="text-sm text-muted-foreground">
                      ({serviceProvider.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {session?.user?.id === id ? (
                    <Link href={`/service-provider/${id}/edit`}>
                      <Button className="w-full sm:w-auto" variant="outline">
                        <Pen className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href={`/messages?provider=${serviceProvider.id}`}>
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Mail className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                      </Link>
                      <Link href={`/hire/${serviceProvider.id}`}>
                        <Button className="w-full sm:w-auto">Hire Now</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{serviceProvider.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Starting at ${serviceProvider.hourlyRate}/hr</span>
                </div>
              </div>

              <p className="text-muted-foreground">{serviceProvider.description}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Main Content */}
          <div className="mt-6">
            {/* <h2 className="text-xl font-semibold mb-4">Services</h2> */}
            <ServicesOffered services={serviceProvider.services} title="Available Services" />

            <Separator className="my-8" />

            <h2 className="text-xl font-semibold mb-4">About {serviceProvider.name}</h2>
            <p className="text-muted-foreground whitespace-pre-line">{serviceProvider.about}</p>

            <Separator className="my-8" />

            <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
            <PortfolioGallery images={serviceProvider?.portfolioImages} title="Recent Work" />

            <Separator className="my-8" />

            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <ReviewList reviews={serviceProvider.reviews} title="Customer Reviews" />
          </div>
        </div>
      </div>
    </div>
  );
}
