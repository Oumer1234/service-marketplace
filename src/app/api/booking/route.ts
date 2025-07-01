import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/booking";
import dbConnect from "@/lib/db";
import getUserSession from "@/hooks/use-get-user-session";
import { writeFile } from "fs/promises";
import { join } from "path";

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

      // Handle file uploads
      for (const file of files) {
        if (file && file.size > 0) {
          // Validate file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
              { error: "File size must be less than 10MB" },
              { status: 400 }
            );
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Create unique filename
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const filename = `${uniqueSuffix}-${file.name}`;
          const uploadDir = join(process.cwd(), "public", "uploads", "booking-attachments");

          // Ensure upload directory exists
          await writeFile(join(uploadDir, filename), buffer);

          // Store the file URL
          const fileUrl = `/uploads/booking-attachments/${filename}`;
          attachments.push(fileUrl);
        }
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
