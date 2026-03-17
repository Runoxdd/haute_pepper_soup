import type { Metadata } from "next";
import { getAllMenuItems } from "@/lib/data";
import { MenuEditor } from "@/components/admin/MenuEditor";
import { SetupWizard } from "@/components/admin/SetupWizard";

export const metadata: Metadata = {
  title: "Menu Management",
};

export default async function AdminMenuPage() {
  const items = await getAllMenuItems();

  if (items.length === 0) {
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
            {items.filter((i) => i.is_active).length} active dishes &middot;{" "}
            {items.filter((i) => !i.is_active).length} inactive
          </p>
        </div>
      </div>

      <MenuEditor
        initialItems={JSON.parse(JSON.stringify(items))}
      />
    </div>
  );
}
