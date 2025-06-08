import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { z } from "zod";
import { profileUpdateSchema } from "@/lib/formValidation";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import getUserSession from "@/hooks/use-get-user-session";

export async function PUT(request: Request) {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = profileUpdateSchema.parse(body);

    await dbConnect();

    // Find user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user name
    user.name = validatedData.name;
    await user.save();

    // Handle password update if provided
    if (validatedData.newPassword) {
      try {
        // Use better-auth's changePassword if current password is provided
        if (validatedData.currentPassword) {
          await auth.api.changePassword({
            body: {
              newPassword: validatedData.newPassword,
              currentPassword: validatedData.currentPassword,
              revokeOtherSessions: true,
            },
            headers: request.headers,
          });
        } else {
          // Use setPassword if no current password (for OAuth users)
          await auth.api.setPassword({
            body: { newPassword: validatedData.newPassword },
            headers: request.headers,
          });
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to update password. Please check your current password." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isServiceProvider: user.isServiceProvider,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
