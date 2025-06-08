'use client';

import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';
import { ServiceProvider } from '@/types';

interface ServiceProviderListItemProps {
  serviceProvider: ServiceProvider;
}

const ServiceProviderListItem = ({
  serviceProvider,
}: ServiceProviderListItemProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            href={`/service-provider/${serviceProvider.id}`}
            className="block relative h-24 w-24 shrink-0 overflow-hidden rounded-md self-center sm:self-start"
          >
            <Image
              src={serviceProvider.profileImage}
              alt={serviceProvider.name}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform hover:scale-105"
            />
          </Link>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <Link
                  href={`/service-provider/${serviceProvider.id}`}
                  className="font-semibold hover:underline text-lg"
                >
                  {serviceProvider.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={serviceProvider.rating} showValue />
                  <span className="text-sm text-muted-foreground">
                    ({serviceProvider.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium">
                  ${serviceProvider.hourlyRate}/hr
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{serviceProvider.serviceType}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3" />
                {serviceProvider.location}
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {serviceProvider.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="sm:w-auto w-full"
              >
                Message
              </Button>
              <Button
                size="sm"
                className="sm:w-auto w-full"
              >
                Hire Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceProviderListItem;
