import mongoose, { Document, Schema, Model } from "mongoose";
import { ServiceProvider as ServiceProviderType } from "@/types";

export interface ServiceProviderDocument extends Document, Omit<ServiceProviderType, "id"> {}

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [3, "Service name must be at least 3 characters long"],
      maxlength: [100, "Service name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      minlength: [10, "Service description must be at least 10 characters long"],
      maxlength: [500, "Service description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: [1, "Price must be at least 1"],
    },
    duration: {
      type: String,
      required: [true, "Service duration is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const serviceProviderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    profileImage: {
      type: String,
      required: false,
    },
    coverImage: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [150, "Description cannot exceed 150 characters"],
    },
    about: {
      type: String,
      required: [true, "About is required"],
      trim: true,
      minlength: [50, "About must be at least 50 characters long"],
      maxlength: [2000, "About cannot exceed 2000 characters"],
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      trim: true,
    },
    portfolioImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: "Cannot upload more than 5 portfolio images",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },
    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      min: [1, "Hourly rate must be at least 1"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    services: {
      type: [serviceSchema],
      required: [true, "At least one service is required"],
      validate: {
        validator: function (v: (typeof serviceSchema)[]) {
          return v.length > 0;
        },
        message: "At least one service must be provided",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
serviceProviderSchema.index({ user: 1 }, { unique: true });
serviceProviderSchema.index({ serviceType: 1 });
serviceProviderSchema.index({ location: 1 });
serviceProviderSchema.index({ rating: -1 });

const ServiceProvider =
  (mongoose.models.ServiceProvider as Model<ServiceProviderDocument>) ||
  mongoose.model<ServiceProviderDocument>("ServiceProvider", serviceProviderSchema);

export default ServiceProvider;
