import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/db";
import ServiceProvider from "@/models/ServiceProvider";
import Review from "@/models/Review";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    await dbConnect();

    // Validate the ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid service provider ID" }, { status: 400 });
    }

    console.log(id);

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
