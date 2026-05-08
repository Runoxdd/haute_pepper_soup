import type { Metadata } from "next";
import { getAllCateringServices } from "@/lib/data";
import { CateringPageClient } from "./client";
import type { CateringService } from "./client";

export const metadata: Metadata = {
  title: "Catering Services",
};

export default async function AdminCateringPage() {
  const services = await getAllCateringServices() as CateringService[];

  return <CateringPageClient initialServices={services} />;
}
