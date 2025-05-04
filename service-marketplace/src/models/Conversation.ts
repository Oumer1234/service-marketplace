// import mongoose, { Document, Schema, Model } from "mongoose";
// import { Conversation as ConversationType } from "@/types";

// // Interface for Conversation document extending Document and ConversationType
// export interface ConversationDocument
//   extends Document,
//     Omit<ConversationType, "id" | "lastMessage"> {
//   lastMessageId: mongoose.Types.ObjectId; // Reference to the last message
// }

// // Conversation schema definition
// const conversationSchema = new Schema<ConversationDocument>(
//   {
//     participants: {
//       type: [Schema.Types.ObjectId],
//       ref: "User",
//       required: [true, "Participants are required"],
//       validate: [
//         (val: mongoose.Types.ObjectId[]) => val.length >= 2,
//         "Conversation must have at least 2 participants",
//       ],
//     },
//     lastMessageId: {
//       type: Schema.Types.ObjectId,
//       ref: "Message",
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     // Additional fields that might be useful
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     title: {
//       type: String,
//       default: "",
//     },
//     // For group conversations
//     isGroup: {
//       type: Boolean,
//       default: false,
//     },
//     adminId: {
//       type: Schema.Types.ObjectId,
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
// conversationSchema.index({ participants: 1 });
// conversationSchema.index({ updatedAt: -1 });

// // Static method to find conversations for a user
// conversationSchema.statics.findConversationsForUser = function (userId: string) {
//   return this.find({ participants: userId })
//     .sort({ updatedAt: -1 })
//     .populate({
//       path: "lastMessageId",
//       model: "Message",
//     })
//     .populate({
//       path: "participants",
//       model: "User",
//       select: "name profileImage",
//     });
// };

// // Create interface for the model with static methods
// interface ConversationModel extends Model<ConversationDocument> {
//   findConversationsForUser(userId: string): Promise<ConversationDocument[]>;
// }

// // Create and export the Conversation model
// const Conversation =
//   (mongoose.models.Conversation as ConversationModel) ||
//   mongoose.model<ConversationDocument, ConversationModel>("Conversation", conversationSchema);

// export default Conversation;
