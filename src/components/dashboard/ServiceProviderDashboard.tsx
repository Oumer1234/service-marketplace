"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { IBooking } from "@/models/booking";
import { User as UserType } from "@/types";
import RecentBookingCardForProvider from "./RecentBookingCardForProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type PopulatedBooking = IBooking & {
  seekerId: UserType;
};

interface Stats {
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  reviewCount: number;
}

export default function ServiceProviderDashboard() {
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, statsRes] = await Promise.all([
          fetch("/api/dashboard/provider/bookings"),
          fetch("/api/dashboard/provider/stats"),
        ]);

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">Edit Profile</Button>
          <Button>Add New Service</Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? (
                `$${stats.totalRevenue.toFixed(2)}`
              ) : (
                <Loader2 className="h-6 w-6 animate-spin" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.totalBookings : <Loader2 className="h-6 w-6 animate-spin" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? (
                stats.averageRating.toFixed(1)
              ) : (
                <Loader2 className="h-6 w-6 animate-spin" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `Based on ${stats.reviewCount} reviews` : "..."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Client Bookings</h2>
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <RecentBookingCardForProvider key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground border rounded-lg">
            You have no bookings yet.
          </div>
        )}
      </div>
    </div>
  );
}
