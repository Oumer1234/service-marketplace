import "better-auth";

declare module "better-auth" {
  interface User {
    role: "user" | "admin" | "service_provider";
    isServiceProvider: boolean;
  }
}
