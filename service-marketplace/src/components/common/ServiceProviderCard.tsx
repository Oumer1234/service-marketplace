'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ServiceProvider } from '@/types';

interface ServiceProviderCardProps {
  serviceProvider: ServiceProvider;
  compact?: boolean;
}

const ServiceProviderCard = ({
  serviceProvider,
  compact = false,
}: ServiceProviderCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/service-provider/${serviceProvider.id}`}>
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={serviceProvider.profileImage}
            alt={serviceProvider.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/service-provider/${serviceProvider.id}`}
              className="font-semibold hover:underline"
            >
              {serviceProvider.name}
            </Link>
            <CardDescription className="line-clamp-2 text-sm">
              {serviceProvider.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{serviceProvider.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({serviceProvider.reviewCount} reviews)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{serviceProvider.serviceType}</Badge>
          <span className="text-sm text-muted-foreground">
            {serviceProvider.location}
          </span>
        </div>
        {!compact && (
          <p className="text-sm text-muted-foreground">
            Starting at <span className="font-medium text-foreground">${serviceProvider.hourlyRate}/hr</span>
          </p>
        )}
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
