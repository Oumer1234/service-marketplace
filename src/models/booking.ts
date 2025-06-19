/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  providerId: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  details: string;
  budget?: number;
  location: string;
  locationDetails?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  attachments?: string[];
  additionalServices?: string[];
  seekerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
    seekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    details: { type: String, required: true },
    budget: { type: Number },
    location: { type: String, required: true },
    locationDetails: { type: String },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    notes: { type: String },
    attachments: [{ type: String }],
    additionalServices: [{ type: String }],
    seekerInfo: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
