// import mongoose, { Document, Schema, Model } from "mongoose";
// import { Category as CategoryType } from "@/types";

// // Interface for Category document extending Document and partial CategoryType
// // We omit 'icon' as it's a React component and can't be stored in MongoDB
// export interface CategoryDocument extends Document, Omit<CategoryType, "id" | "icon"> {
//   iconName: string; // Store the icon name instead of the actual component
// }

// // Category schema definition
// const categorySchema = new Schema<CategoryDocument>(
//   {
//     name: {
//       type: String,
//       required: [true, "Category name is required"],
//       trim: true,
//       unique: true,
//     },
//     iconName: {
//       type: String,
//       required: [true, "Icon name is required"],
//       trim: true,
//     },
//     // Additional fields that might be useful
//     description: {
//       type: String,
//       default: "",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     order: {
//       type: Number,
//       default: 0,
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

// // Add indexes for better performance
// categorySchema.index({ name: 1 }, { unique: true });
// categorySchema.index({ order: 1 });

// // Create and export the Category model
// const Category =
//   (mongoose.models.Category as Model<CategoryDocument>) ||
//   mongoose.model<CategoryDocument>("Category", categorySchema);

// export default Category;
