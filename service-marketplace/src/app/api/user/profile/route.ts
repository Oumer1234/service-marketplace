// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { profileUpdateSchema } from "@/lib/formValidation";
// import { hash } from "bcryptjs";
// import User from "@/models/User";
//   import connectToDatabase from "@/lib/db";

// import getUserSession from "@/hooks/use-get-user-session";

// export async function PUT(request: Request) {
//   try {
//     const session = await getUserSession();
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     const validatedData = profileUpdateSchema.parse(body);

//     // Connect to database
//     await connectToDatabase();

//     // Find and update user
//     const user = await User.findById(session.user.id);
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Update user fields
//     user.name = validatedData.name;

//     // Only update password if it's provided
//     if (validatedData.newPassword) {
//       // Verify current password if provided
//       if (validatedData.currentPassword) {
//         const isPasswordValid = await user.comparePassword(validatedData.currentPassword);
//         if (!isPasswordValid) {
//           return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
//         }
//       }
//       user.password = await hash(validatedData.newPassword, 10);
//     }

//     await user.save();

//     return NextResponse.json({
//       message: "Profile updated successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         // image: user?.image,
//         role: user.role,
//         isServiceProvider: user.isServiceProvider,
//       },
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: error.errors }, { status: 400 });
//     }
//     console.error("Profile update error:", error);
//     return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
//   }
// }
