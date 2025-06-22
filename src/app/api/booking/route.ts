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

interface FormDataBody {
  providerId: string;
  seekerId: string;
  date: string;
  time: string;
  details: string;
  budget?: number;
  location: string;
  locationDetails?: string;
  service: string;
  additionalServices: string[];
  seekerInfo?: BookingBody["seekerInfo"];
}

export async function POST(req: NextRequest) {
  const session = await getUserSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const contentType = req.headers.get("content-type") || "";
    const attachments: string[] = [];
    let bookingData: Partial<FormDataBody> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("attachments") as File[];
      for (const file of files) {
        attachments.push(file.name);
      }

      bookingData = {
        providerId: formData.get("providerId") as string,
        seekerId: session.session.userId,
        date: formData.get("date") as string,
        time: formData.get("time") as string,
        details: formData.get("details") as string,
        budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
        location: formData.get("location") as string,
        locationDetails: formData.get("locationDetails") as string | undefined,
        service: formData.get("service") as string,
        additionalServices: formData.getAll("additionalServices") as string[],
        seekerInfo: formData.get("seekerInfo")
          ? JSON.parse(formData.get("seekerInfo") as string)
          : undefined,
      };
    } else {
      const body = await req.json();
      bookingData = { ...body, seekerId: session.session.userId };
    }

    const {
      providerId,
      seekerId,
      date,
      time,
      details,
      budget,
      location,
      locationDetails,
      service,
      additionalServices,
      seekerInfo,
    } = bookingData;

    if (!providerId || !date || !time || !details || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await Booking.create({
      providerId,
      seekerId,
      date,
      time,
      service,
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
