import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, magicLink } from "better-auth/plugins";
import { sendEmail } from "./email-service";
import dbConnect from "../db";
import { nextCookies } from "better-auth/next-js";
import {
  emailVerificationTemplate,
  magicLinkTemplate,
  passwordResetTemplate,
} from "./templates/templates";
import mongoose from "mongoose";

await dbConnect();
const db = mongoose.connection.db;

if (!db) {
  throw new Error("Database connection is not established.");
}

export const auth = betterAuth({
  // trustedOrigins: ["http://localhost:3000"],
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password ",
        html: passwordResetTemplate(url),
      });
      console.log("Send Reset Password : ", token, request);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    },
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          console.log("session create", session);
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        enum: ["user", "admin", "service_provider"],
      },
      isServiceProvider: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      serviceProviderId: {
        type: "number",
        required: false,
      },
    },
    update: {
      before: async (session: Record<string, unknown>) => {
        console.log("session update before", session);
      },
      after: async (session: Record<string, unknown>) => {
        console.log("session update after", session);
      },
    },
  },
  emailVerification: {
    enabled: true,
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await sendEmail({
        to: user.email,
        subject: "Welcome to Service Inc - Verify Your Email",
        html: emailVerificationTemplate(url),
      });
    },
  },
  plugins: [
    admin(),
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        await sendEmail({
          to: email,
          subject: "Sign In to Service Inc",
          html: magicLinkTemplate(url),
        });
        console.log(token, request);
      },
    }),
  ],
});

export type UserSession = typeof auth.$Infer.Session;
export type User = UserSession["user"];
export type Session = UserSession["session"];
