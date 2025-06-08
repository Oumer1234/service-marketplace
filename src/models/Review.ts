import mongoose, { Document, Schema, Model } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    userImage: {
      type: String,
      default: "",
    },
    serviceProviderId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: [true, "Service provider ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: "reviews", // Optional: explicitly define the collection name
  }
);

// Export the Review model (create only if not already created)
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
