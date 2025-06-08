import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { writeFile } from "fs/promises";
import { join } from "path";
import getUserSession from "@/hooks/use-get-user-session";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const session = await getUserSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "profile-images");

    // Ensure upload directory exists
    await writeFile(join(uploadDir, filename), buffer);

    // Update user profile in database
    await dbConnect();

    const imageUrl = `/uploads/profile-images/${filename}`;

    await User.updateOne({ _id: new ObjectId(session.user.id) }, { $set: { image: imageUrl } });

    return NextResponse.json({
      message: "Profile image updated successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return NextResponse.json({ error: "Failed to update profile image" }, { status: 500 });
  }
}
