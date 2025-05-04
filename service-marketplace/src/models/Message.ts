// import mongoose, { Document, Schema, Model } from "mongoose";
// import { Message as MessageType } from "@/types";

// // Interface for Message document extending Document and MessageType
// export interface MessageDocument extends Document, Omit<MessageType, "id"> {}

// // Message schema definition
// const messageSchema = new Schema<MessageDocument>(
//   {
//     senderId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Sender ID is required"],
//     },
//     receiverId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Receiver ID is required"],
//     },
//     content: {
//       type: String,
//       required: [true, "Message content is required"],
//       trim: true,
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//     isRead: {
//       type: Boolean,
//       default: false,
//     },
//     conversationId: {
//       type: Schema.Types.ObjectId,
//       ref: "Conversation",
//       required: [true, "Conversation ID is required"],
//     },
//     // Additional fields that might be useful
//     attachments: {
//       type: [String],
//       default: [],
//     },
//     deletedForUsers: {
//       type: [Schema.Types.ObjectId],
//       default: [],
//       ref: "User",
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
// messageSchema.index({ conversationId: 1, timestamp: 1 });
// messageSchema.index({ senderId: 1, timestamp: 1 });
// messageSchema.index({ receiverId: 1, timestamp: 1 });
// messageSchema.index({ isRead: 1 });

// // Create and export the Message model
// const Message =
//   (mongoose.models.Message as Model<MessageDocument>) ||
//   mongoose.model<MessageDocument>("Message", messageSchema);

// export default Message;
