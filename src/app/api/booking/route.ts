import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/booking";
import dbConnect from "@/lib/db";
import getUserSession from "@/hooks/use-get-user-session";

interface BookingBody {
  providerId: string;
  seekerId?: string;
  date: string;
  time: string;
  details: string;
  budget?: number;
  location: string;
  locationDetails?: string;
  additionalServices?: string[];
  seekerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: unknown;
  };
}

export async function POST(req: NextRequest) {
  const session = await getUserSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    // Check if it's a multipart form for file uploads
    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, unknown> = {};
    const attachments: string[] = [];
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = JSON.parse(formData.get("data") as string);
      const files = formData.getAll("attachments") as File[];
      for (const file of files) {
        // Save file logic here (e.g., to /uploads/booking-attachments)
        // For now, just push file.name as a placeholder
        attachments.push(file.name);
      }
    } else {
      body = await req.json();
    }
    // Instead of destructuring with 'as BookingBody', map fields explicitly
    const providerId = typeof body.providerId === "string" ? body.providerId : "";
    const seekerId = typeof body.seekerId === "string" ? body.seekerId : undefined;
    const date = typeof body.date === "string" ? body.date : "";
    const time = typeof body.time === "string" ? body.time : "";
    const details = typeof body.details === "string" ? body.details : "";
    const budget = typeof body.budget === "number" ? body.budget : undefined;
    const location = typeof body.location === "string" ? body.location : "";
    const locationDetails =
      typeof body.locationDetails === "string" ? body.locationDetails : undefined;
    const additionalServices = Array.isArray(body.additionalServices)
      ? (body.additionalServices as string[])
      : undefined;
    const seekerInfo =
      typeof body.seekerInfo === "object"
        ? (body.seekerInfo as BookingBody["seekerInfo"])
        : undefined;
    if (!providerId || !date || !time || !details || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const booking = await Booking.create({
      providerId,
      seekerId: seekerId || "000000000000000000000000",
      date,
      time,
      details,
      budget,
      location,
      locationDetails,
      status: "pending",
      attachments,
      additionalServices,
      seekerInfo,
    });
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
