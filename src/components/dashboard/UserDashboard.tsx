"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import RecentBookingCard from "./RecentBookingCard";
import { IBooking } from "@/models/booking";
import { ServiceProviderDocument } from "@/models/ServiceProvider";

type PopulatedBooking = IBooking & {
  providerId: ServiceProviderDocument & { user: { _id: string; id: string } };
};

export default function UserDashboard() {
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/dashboard/user/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Button>Book a New Service</Button>
      </header>

      {loading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">All My Bookings</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <RecentBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-muted-foreground border rounded-lg">
          You have not made any bookings yet.
        </div>
      )}
    </div>
  );
}
