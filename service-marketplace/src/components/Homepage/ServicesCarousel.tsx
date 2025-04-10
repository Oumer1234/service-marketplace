"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceProviders } from "@/lib/data";
import { ServiceProvider } from "@/types";
import Link from "next/link";

type ServiceTag = {
  name: string;
};

type Service = {
  id: string;
  title: string;
  image: string;
  price: string;
  tags: ServiceTag[];
};

// const services: Service[] = [
//   {
//     id: "cleaning",
//     title: "Cleaning Services",
//     image: "/placeholder.svg?height=400&width=300",
//     price: "$30",
//     tags: [{ name: "Home Cleaning" }, { name: "Office Cleaning" }, { name: "Deep Cleaning" }],
//   },
//   {
//     id: "home-maintenance",
//     title: "Home Maintenance",
//     image: "/placeholder.svg?height=400&width=300",
//     price: "$35",
//     tags: [{ name: "Furniture Installation" }, { name: "Repair" }, { name: "Plumbing" }],
//   },
//   {
//     id: "moving",
//     title: "Moving & Delivery",
//     image: "/placeholder.svg?height=400&width=300",
//     price: "$25",
//     tags: [{ name: "Cleaning" }, { name: "Plumbing" }, { name: "Repair" }],
//   },
//   {
//     id: "outdoor",
//     title: "Outdoor Services",
//     image: "/placeholder.svg?height=400&width=300",
//     price: "$20",
//     tags: [{ name: "Lawn Care" }, { name: "Gardening" }, { name: "Snow Removal" }],
//   },
//   {
//     id: "electrical",
//     title: "Electrical Services",
//     image: "/placeholder.svg?height=400&width=300",
//     price: "$40",
//     tags: [{ name: "Installation" }, { name: "Repair" }, { name: "Inspection" }],
//   },
// ];

export default function ServicesCarousel() {
  return (
    <section className="w-full py-12">
      <div className="w-11/12 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Discover Most Popular Services Providers
          </h2>
          <p className="text-muted-foreground max-w-[700px]">
            Explore our most in-demand services providers, trusted by other customers for their
            exceptional quality and reliability.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {serviceProviders.map((service) => (
              <CarouselItem key={service.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <ServiceCard service={service} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="" />
            <CarouselNext className="" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: ServiceProvider }) {
  return (
    <Link href={`/service-provider/${service.id}`}>
      <Card className="overflow-hidden h-full border-0 shadow-md dark:bg-gray-800 relative">
        <div className="relative h-[600px] w-full">
          <div className="absolute top-4 left-4 z-20 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-sm">
            Start from {service.hourlyRate}/hr
          </div>

          <Image
            src={service?.portfolioImages[0]}
            alt={service.name}
            fill
            className="object-cover hover:scale-110 transition-all duration-300"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10  bg-gradient-to-t from-sky-800 via-gray-600 to-transparent p-4">
          <h3 className="text-xl font-semibold mb-2 text-white dark:text-gray-900">
            {service.name}
            <span className="text-sm font-medium ml-2 text-gray-300 dark:text-gray-800">
              {service.rating}
            </span>
            <span className="text-sm text-gray-300 dark:text-gray-800 font-medium ml-1">
              ( {service.reviewCount} reviews )
            </span>
          </h3>
          {/* <div className="flex items-center gap-2"> */}
          <p className="line-clamp-1 mb-2 text-sm text-gray-300 dark:text-gray-900">
            {service.description}
          </p>
          {service.services.map((tag) => (
            <Badge
              key={tag.name}
              variant="outline"
              className="bg-background dark:bg-gray-700 mx-px"
            >
              {tag.name}
            </Badge>
          ))}
          {/* </div> */}
        </div>
      </Card>
    </Link>
  );
}
