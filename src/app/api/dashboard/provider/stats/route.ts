import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import getUserSession from "@/hooks/use-get-user-session";
import Booking from "@/models/booking";
import ServiceProvider from "@/models/ServiceProvider";

export async function GET(req: NextRequest) {
  const session = await getUserSession();
  if (!session?.user || session.user.role !== "service_provider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const serviceProvider = await ServiceProvider.findOne({ user: session.user.id });
    if (!serviceProvider) {
      return NextResponse.json({ error: "Service provider profile not found" }, { status: 404 });
    }

    const bookings = await Booking.find({ providerId: serviceProvider._id });

    const totalRevenue = bookings
      .filter((b) => b.status === "accepted" && b.budget)
      .reduce((acc, b) => acc + (b.budget || 0), 0);

    const totalBookings = bookings.length;

    const stats = {
      totalRevenue,
      totalBookings,
      averageRating: serviceProvider.rating,
      reviewCount: serviceProvider.reviewCount,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
