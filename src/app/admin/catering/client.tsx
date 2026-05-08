"use client";

import { CateringEditor } from "@/components/admin/CateringEditor";

export interface CateringService {
  _id: string;
  name: string;
  slug: string;
  description: string;
  starting_price: number;
  image_url: string;
  includes: string[];
  highlights: string[];
  is_active: boolean;
  sort_order: number;
}

interface CateringPageClientProps {
  initialServices: CateringService[];
}

export function CateringPageClient({ initialServices }: CateringPageClientProps) {
  // Serialize for client component
  const serialized = JSON.parse(JSON.stringify(initialServices));

  return <CateringEditor initialServices={serialized} />;
}