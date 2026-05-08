import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { UploadRouter } from "@/app/api/upload/core";

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();
