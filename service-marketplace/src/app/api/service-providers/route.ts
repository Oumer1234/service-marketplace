import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { writeFile } from "fs/promises";
import { join } from "path";
import getUserSession from "@/hooks/use-get-user-session";
import dbConnect from "@/lib/db";
import ServiceProvider from "@/models/ServiceProvider";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const data = JSON.parse(formData.get("data") as string);

    // Handle cover image upload
    const coverImage = formData.get("coverImage") as File;
    let coverImageUrl = "";

    if (coverImage) {
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${coverImage.name}`;
      const uploadDir = join(process.cwd(), "public", "uploads", "cover-images");

      await writeFile(join(uploadDir, filename), buffer);
      coverImageUrl = `/uploads/cover-images/${filename}`;
    }

    // Handle portfolio images upload
    const portfolioImages = formData.getAll("portfolioImages") as File[];
    const portfolioImageUrls: string[] = [];

    for (const image of portfolioImages) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name}`;
      const uploadDir = join(process.cwd(), "public", "uploads", "portfolio-images");

      await writeFile(join(uploadDir, filename), buffer);
      portfolioImageUrls.push(`/uploads/portfolio-images/${filename}`);
    }

    await dbConnect();

    const serviceProvider = await ServiceProvider.create({
      user: session.user.id,
      ...data,
      profileImage: session.user.image || "",
      coverImage: coverImageUrl,
      portfolioImages: portfolioImageUrls,
      isVerified: false,
      rating: 0,
      reviewCount: 0,
    });

    const user = await User.findByIdAndUpdate(session.user.id, {
      role: "service_provider",
      isServiceProvider: true,
    });

    return NextResponse.json(serviceProvider, { status: 201 });
  } catch (error) {
    console.error("Error creating service provider:", error);
    return NextResponse.json({ error: "Failed to create service provider" }, { status: 500 });
  }
}
