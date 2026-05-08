import type { Metadata } from "next";
import { getAllMenuItems } from "@/lib/data";
import { MenuPageClient } from "./client";
import type { MenuItem } from "@/types";

export const metadata: Metadata = {
  title: "Menu Management",
};

export default async function AdminMenuPage() {
  const items = await getAllMenuItems() as MenuItem[];

  return <MenuPageClient initialItems={items} />;
}
