import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * Uploadthing file router — admin-only image uploads.
 * Max 2MB, JPEG/PNG/WebP only.
 */
export const uploadRouter = {
  menuImage: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
      acl: "public-read",
    },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.email || !isAdmin(session.user.email)) {
        throw new Error("Unauthorized");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
