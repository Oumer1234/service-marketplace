import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import getUserSession from "@/hooks/use-get-user-session";
import dbConnect from "@/lib/db";
import Booking from "@/models/booking";
import ServiceProvider from "@/models/ServiceProvider";

export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getUserSession();

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // console.log("USER ID  : ", session);

  try {
    const serviceProvider = await ServiceProvider.findOne({ user: userId });

    if (!serviceProvider) {
      return NextResponse.json({ message: "Service provider not found" }, { status: 404 });
    }

    const serviceProviderId = serviceProvider._id;

    let bookings = await Booking.find({
      providerId: serviceProviderId,
      seekerId: { $ne: null },
    }).populate({
      path: "seekerId",
      model: User,
    });

    bookings = bookings.filter((booking) => booking.seekerId);

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
