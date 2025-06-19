/* eslint-disable @typescript-eslint/no-explicit-any */

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sortBy = searchParams.get("sortBy") || "rating";
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    await dbConnect();

    // Build query
    const query: any = {};
    if (category) {
      query.serviceType = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort options
    const sortOptions: any = {};
    switch (sortBy) {
      case "price":
        sortOptions.hourlyRate = 1;
        break;
      case "rate":
        sortOptions.rating = -1;
        break;
      case "alphabet":
        sortOptions.name = 1;
        break;
      default:
        sortOptions.rating = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch service providers with pagination
    const [serviceProviders, total] = await Promise.all([
      ServiceProvider.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate("user", "name email image"),
      ServiceProvider.countDocuments(query),
    ]);

    function getUserId(user: any): string {
      if (user && typeof user === "object" && "_id" in user) {
        return String(user._id);
      }
      return String(user);
    }

    // Transform the data to match the frontend expectations
    const transformedProviders = serviceProviders.map((provider) => ({
      id: provider.id.toString(),
      userId: getUserId(provider.user),
      name: provider.name,
      profileImage: provider.profileImage || provider.profileImage,
      coverImage: provider.coverImage,
      location: provider.location,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      hourlyRate: provider.hourlyRate,
      description: provider.description,
      serviceType: provider.serviceType,
      portfolioImages: provider.portfolioImages,
      about: provider.about,
      services: provider.services.map((service: any) => ({
        id: service._id.toString(),
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
      })),
    }));

    return NextResponse.json({
      serviceProviders: transformedProviders,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    return NextResponse.json({ error: "Failed to fetch service providers" }, { status: 500 });
  }
}
