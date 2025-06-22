"use client";

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
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
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
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import { User as UserType } from "@/types";

interface RecentBookingCardForProviderProps {
  booking: IBooking & { seekerId: UserType };
}

const statusIcons = {
  pending: <HelpCircle className="h-4 w-4 text-yellow-500" />,
  accepted: <CheckCircle className="h-4 w-4 text-green-500" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
};

const RecentBookingCardForProvider = ({ booking }: RecentBookingCardForProviderProps) => {
  const seeker = booking.seekerId;

  if (!seeker) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Seeker information is not available for this booking.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md w-full">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="font-semibold flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={seeker.profileImage} alt={seeker.name} />
              <AvatarFallback>{seeker.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="flex items-center gap-3">{seeker.name}</span>
              <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {seeker.email}
              </span>
              {booking.seekerInfo?.phone && (
                <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {booking.seekerInfo.phone}
                </span>
              )}
            </div>
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
            <p className="text-sm font-medium w-full">Additional Services:</p>
            {booking.additionalServices.map((service, index) => (
              <Badge key={index} variant="outline">
                {service}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" className="flex-1">
          Accept
        </Button>
        <Button variant="destructive" size="sm" className="flex-1">
          Decline
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentBookingCardForProvider;
