"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { ServiceProvider } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ServiceProviderCardProps {
  serviceProvider: ServiceProvider;
  compact?: boolean;
}

const ServiceProviderCard = ({ serviceProvider, compact = false }: ServiceProviderCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/service-provider/${serviceProvider.id}`}>
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={serviceProvider.portfolioImages[0]}
            alt={serviceProvider.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-4 left-4 z-20 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-sm">
            Start from {serviceProvider.hourlyRate}/hr
          </div>
          <div className="absolute top-4 right-4 z-20 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-sm">
            {serviceProvider.location}/hr
          </div>
        </div>
      </Link>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/service-provider/${serviceProvider.id}`}
              className="font-semibold hover:underline flex items-center gap-3 mb-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={serviceProvider.profileImage} alt={serviceProvider.name} />
                <AvatarFallback>{serviceProvider.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="flex items-center gap-3">
                  {serviceProvider.name}
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{serviceProvider.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({serviceProvider.reviewCount} reviews)
                    </span>
                  </span>
                </span>
                <span className="text-xs text-gray-500 font-normal line-clamp-1 inline">
                  {serviceProvider.description}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {serviceProvider.services.map((service) => (
              <Badge key={service.id} variant="outline">
                {service.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      {!compact && (
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button variant="secondary" size="sm" className="flex-1">
            Message
          </Button>
          <Button size="sm" className="flex-1">
            Hire Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ServiceProviderCard;
