import { mkdir } from "fs/promises";
import { join } from "path";

async function createUploadDirectories() {
  const uploadDirs = [
    join(process.cwd(), "public", "uploads"),
    join(process.cwd(), "public", "uploads", "profile-images"),
    join(process.cwd(), "public", "uploads", "booking-attachments"),
  ];

  for (const dir of uploadDirs) {
    try {
      await mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        console.error(`Error creating directory ${dir}:`, error);
      }
    }
  }
}

createUploadDirectories().catch(console.error);
