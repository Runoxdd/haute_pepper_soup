"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "@/lib/toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-glass-border bg-glass-bg/50 p-6 transition-colors hover:border-brand-lemon-dark/50 dark:hover:border-brand-lemon/50">
        {value ? (
          <div className="relative group aspect-video w-full overflow-hidden rounded-xl border border-glass-border">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                title="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75V4H5a2 2 0 00-2 2v.038C3 6.05 3.003 6.063 3.006 6.076A.75.75 0 012 6.75a.75.75 0 01.75-.75h14.5a.75.75 0 01.75.75.75.75 0 01-1.006.726c.003-.013.006-.026.006-.038V6a2 2 0 00-2-2h-1V3.75A2.75 2.75 0 0011.25 1h-2.5zM7.5 4h5v-.25A1.25 1.25 0 0011.25 2.5h-2.5A1.25 1.25 0 007.5 3.75V4zM4 8v8.25A2.75 2.75 0 006.75 19h6.5A2.75 2.75 0 0016 16.25V8H4zm4.75 2a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zM11.25 10a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-brand-lemon-dark dark:text-brand-lemon"
              >
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                <line x1="16" y1="5" x2="22" y2="5" />
                <line x1="19" y1="2" x2="19" y2="8" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <p className="mb-1 text-sm font-semibold text-text-primary">
              Upload dish photo
            </p>
            <p className="text-xs text-text-muted">
              JPEG, PNG or WebP (max 2MB)
            </p>
          </div>
        )}

        <UploadButton
          endpoint="menuImage"
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            setIsUploading(false);
            if (res?.[0]) {
              onChange(res[0].ufsUrl);
              toast.success("Image uploaded successfully!");
            }
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            toast.error(`Upload failed: ${error.message}`);
          }}
          appearance={{
            button: `ut-uploading:cursor-not-allowed rounded-xl bg-brand-lemon-dark px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-lemon-dark/90 active:scale-95 dark:bg-brand-lemon dark:text-brand-dark dark:hover:bg-brand-lemon/90 ${
              isUploading ? "opacity-50" : ""
            }`,
            allowedContent: "hidden",
          }}
          content={{
            button({ ready }) {
              if (isUploading) return "Uploading...";
              if (ready) return value ? "Change Photo" : "Choose File";
              return "Loading...";
            },
          }}
        />
      </div>
    </div>
  );
}
