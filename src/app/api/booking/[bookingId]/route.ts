/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/models/booking";
import getUserSession from "@/hooks/use-get-user-session";
import ServiceProvider from "@/models/ServiceProvider";
import User from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: { bookingId: string } }) {
  const session = await getUserSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { bookingId } = params;

  try {
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "providerId",
        model: ServiceProvider,
        populate: {
          path: "user",
          model: User,
          select: "name email image",
        },
      })
      .populate({
        path: "seekerId",
        model: User,
        select: "name email image",
      });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Security check: ensure the user is either the seeker or the provider
    const isSeeker = booking.seekerId._id.toString() === session.user.id;
    // const isProvider = booking.providerId.user._id.toString() === session.user.id;
    const isProvider = (booking.providerId as any).user._id.toString() === session.user.id;

    if (!isSeeker && !isProvider) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error(`Failed to fetch booking ${bookingId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { bookingId: string } }) {
  const session = await getUserSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { bookingId } = params;
  const { status } = await req.json();

  if (!status || !["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const bookingToUpdate = await Booking.findById(bookingId)
      .populate({ path: "providerId", select: "user" })
      .select("status providerId");

    if (!bookingToUpdate) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const providerUserId = (bookingToUpdate.providerId as any).user.toString();

    if (providerUserId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (bookingToUpdate.status !== "pending") {
      return NextResponse.json(
        { error: `Booking status is already '${bookingToUpdate.status}'` },
        { status: 400 }
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true })
      .populate({
        path: "providerId",
        model: ServiceProvider,
        populate: {
          path: "user",
          model: User,
          select: "name email image",
        },
      })
      .populate({
        path: "seekerId",
        model: User,
        select: "name email image",
      });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error(`Failed to update booking ${bookingId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
