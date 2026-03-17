import type { Metadata } from "next";
import { getAllCateringServices } from "@/lib/data";
import { CateringEditor } from "@/components/admin/CateringEditor";

export const metadata: Metadata = {
  title: "Catering Services",
};

export default async function AdminCateringPage() {
  const services = await getAllCateringServices();

  // Serialize for client component
  const serialized = JSON.parse(JSON.stringify(services));

  return <CateringEditor initialServices={serialized} />;
}
