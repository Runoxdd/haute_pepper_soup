"use client";

import { MenuEditor } from "@/components/admin/MenuEditor";
import { SetupWizard } from "@/components/admin/SetupWizard";
import type { MenuItem } from "@/types";

interface MenuPageClientProps {
  initialItems: MenuItem[];
}

export function MenuPageClient({ initialItems }: MenuPageClientProps) {
  if (initialItems.length === 0) {
    return <SetupWizard />;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
            Menu
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {initialItems.filter((i) => i.is_active).length} active dishes &middot;{" "}
            {initialItems.filter((i) => !i.is_active).length} inactive
          </p>
        </div>
      </div>

      <MenuEditor
        initialItems={JSON.parse(JSON.stringify(initialItems))}
      />
    </div>
  );
}