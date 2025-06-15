import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import "@/models/User";
import ServiceProvider from "@/models/ServiceProvider";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import path from "path";
import getUserSession from "@/hooks/use-get-user-session";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    await dbConnect();

    // Validate the ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid service provider ID" }, { status: 400 });
    }

    console.log("service provider id : ", id);

    // Find the service provider
    const serviceProvider = await ServiceProvider.findOne({ user: id }).populate({
      path: "user",
      select: "name email image",
    });

    if (!serviceProvider) {
      return NextResponse.json({ error: "Service provider not found" }, { status: 404 });
    }

    // Find reviews for this service provider
    const reviews = await Review.find({
      serviceProviderId: new ObjectId(id),
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Transform the data to match the frontend expectations
    const response = {
      ...serviceProvider.toJSON(),
      id: serviceProvider._id?.toString(),
      reviews: reviews.map((review) => ({
        ...review.toJSON(),
        id: review._id?.toString(),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching service provider:", error);
    return NextResponse.json(
      { error: "Failed to fetch service provider details" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getUserSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid service provider ID" }, { status: 400 });
    }

    await dbConnect();

    // Check if the service provider exists and belongs to the user
    const existingProvider = await ServiceProvider.findOne({ user: session.user.id });
    if (!existingProvider) {
      return NextResponse.json({ error: "Service provider not found" }, { status: 404 });
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const data = JSON.parse(formData.get("data") as string);
    const coverImage = formData.get("coverImage") as File | null;
    const portfolioImages = formData.getAll("portfolioImages") as File[];

    // Handle cover image upload
    let coverImagePath = existingProvider.coverImage;
    if (coverImage) {
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `cover-${Date.now()}-${coverImage.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      await writeFile(filePath, buffer);
      coverImagePath = `/uploads/${fileName}`;
    }

    // Handle portfolio images upload
    let portfolioImagePaths = existingProvider.portfolioImages || [];
    if (portfolioImages.length > 0) {
      const newPortfolioImages = await Promise.all(
        portfolioImages.map(async (file) => {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `portfolio-${Date.now()}-${file.name}`;
          const filePath = path.join(process.cwd(), "public/uploads", fileName);
          await writeFile(filePath, buffer);
          return `/uploads/${fileName}`;
        })
      );
      portfolioImagePaths = [...portfolioImagePaths, ...newPortfolioImages];
    }

    // Update the service provider
    const updatedProvider = await ServiceProvider.findOneAndUpdate(
      { user: session.user.id },
      {
        ...data,
        coverImage: coverImagePath,
        portfolioImages: portfolioImagePaths,
      },
      { new: true }
    ).populate({
      path: "user",
      select: "name email image",
    });

    if (!updatedProvider) {
      return NextResponse.json({ error: "Failed to update service provider" }, { status: 500 });
    }

    return NextResponse.json({
      ...updatedProvider.toJSON(),
      id: updatedProvider._id?.toString(),
    });
  } catch (error) {
    console.error("Error updating service provider:", error);
    return NextResponse.json({ error: "Failed to update service provider" }, { status: 500 });
  }
}
