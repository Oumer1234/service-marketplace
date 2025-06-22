"use client";

import React from "react";
import {
  Star,
  Calendar,
  Clock,
  MapPin,
  Tag,
  FileText,
  CheckCircle,
  HelpCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IBooking } from "@/models/booking";
import { ServiceProviderDocument } from "@/models/ServiceProvider";
import { format } from "date-fns";
import { Separator } from "../ui/separator";

interface RecentBookingCardProps {
  booking: IBooking & {
    providerId: ServiceProviderDocument & { user: { _id: string; id: string } };
  };
}

const statusIcons = {
  pending: <HelpCircle className="h-4 w-4 text-yellow-500" />,
  accepted: <CheckCircle className="h-4 w-4 text-green-500" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
};

const RecentBookingCard = ({ booking }: RecentBookingCardProps) => {
  const provider = booking.providerId;

  if (!provider) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Provider information is not available for this booking.</p>
        </CardContent>
      </Card>
    );
  }

  const providerPageUrl = provider.user
    ? `/service-provider/${provider.user.id || provider.user._id}`
    : "#";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md w-full">
      <Link href={providerPageUrl}>
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={provider.portfolioImages?.[0] || "/placeholder.jpg"}
            alt={provider.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-4 left-4 z-20 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-sm flex items-center gap-2">
            <Tag className="h-4 w-4" /> Start from ${provider.hourlyRate}/hr
          </div>
          <div className="absolute top-4 right-4 z-20 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {provider.location}
          </div>
        </div>
      </Link>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={providerPageUrl}
              className="font-semibold hover:underline flex items-center gap-3 mb-3"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={provider.profileImage} alt={provider.name} />
                <AvatarFallback>{provider.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="flex items-center gap-3">
                  {provider.name}
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{provider.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({provider.reviewCount} reviews)
                    </span>
                  </span>
                </span>
                <span className="text-xs text-gray-500 font-normal line-clamp-2 inline ">
                  {provider.description}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <Separator />
        <CardDescription>Booking Details</CardDescription>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(booking.date), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>{booking.service}</span>
          </div>
          <div className="flex items-center gap-2 capitalize">
            {statusIcons[booking.status]}
            <span>{booking.status}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex items-start gap-2">
          <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
          <p className="line-clamp-2">{booking.details}</p>
        </div>

        {booking.additionalServices && booking.additionalServices.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {booking.additionalServices.map((service, index) => (
              <Badge key={index} variant="outline">
                {service}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="secondary" size="sm" className="flex-1">
          Message Provider
        </Button>
        <Button size="sm" className="flex-1">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentBookingCard;
