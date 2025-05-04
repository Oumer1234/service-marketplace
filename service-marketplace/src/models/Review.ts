// import mongoose, { Document, Schema, Model } from "mongoose";
// import { Review as ReviewType } from "@/types";

// // Interface for Review document extending both Document and ReviewType
// export interface ReviewDocument extends Document, Omit<ReviewType, "id"> {}

// // Review schema definition
// const reviewSchema = new Schema<ReviewDocument>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "User ID is required"],
//     },
//     userName: {
//       type: String,
//       required: [true, "User name is required"],
//       trim: true,
//     },
//     userImage: {
//       type: String,
//       default: "",
//     },
//     serviceProviderId: {
//       type: Schema.Types.ObjectId,
//       ref: "ServiceProvider",
//       required: [true, "Service provider ID is required"],
//     },
//     rating: {
//       type: Number,
//       required: [true, "Rating is required"],
//       min: [1, "Rating must be at least 1"],
//       max: [5, "Rating cannot be more than 5"],
//     },
//     comment: {
//       type: String,
//       required: [true, "Comment is required"],
//       trim: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true, // Automatically add createdAt and updatedAt
//     toJSON: {
//       transform: (_, ret) => {
//         ret.id = ret._id.toString();
//         delete ret._id;
//         delete ret.__v;
//         return ret;
//       },
//     },
//   }
// );

// // Add indexes for better query performance
// reviewSchema.index({ serviceProviderId: 1, createdAt: -1 });
// reviewSchema.index({ userId: 1, createdAt: -1 });

// // Create and export the Review model
// const Review =
//   (mongoose.models.Review as Model<ReviewDocument>) ||
//   mongoose.model<ReviewDocument>("Review", reviewSchema);

// export default Review;
