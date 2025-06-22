import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import getUserSession from "@/hooks/use-get-user-session";
import Booking from "@/models/booking";

export async function GET(req: NextRequest) {
  const session = await getUserSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const bookings = await Booking.find({ seekerId: session.user.id })
      .populate({
        path: "providerId",
        populate: {
          path: "user",
          select: "id",
        },
      })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
