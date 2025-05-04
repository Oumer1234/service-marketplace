import mongoose, { Document, Schema, Model } from "mongoose";
import { ServiceProvider as ServiceProviderType } from "@/types";

export interface ServiceProviderDocument extends Document, Omit<ServiceProviderType, "id"> {}

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
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
    },
    about: {
      type: String,
      required: [true, "About is required"],
      trim: true,
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      trim: true,
    },
    portfolioImages: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    services: {
      name: {
        type: String,
        required: [true, "Service name is required"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "Service description is required"],
        trim: true,
      },
      price: {
        type: Number,
        required: [true, "Service price is required"],
      },
      duration: {
        type: String,
        required: [true, "Service duration is required"],
        trim: true,
      },
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
    services: [serviceSchema],
  },
  {
    timestamps: true,
  }
);

const ServiceProvider =
  (mongoose.models.ServiceProvider as Model<ServiceProviderDocument>) ||
  mongoose.model<ServiceProviderDocument>("ServiceProvider", serviceProviderSchema);

export default ServiceProvider;
