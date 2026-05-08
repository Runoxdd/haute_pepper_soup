"use client";

import { useState, useCallback, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
const ImageUpload = dynamic(() => import("./ImageUpload").then(mod => mod.ImageUpload), { ssr: false });
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatNGN } from "@/lib/format";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MenuItemData {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available_sides: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MenuEditorProps {
  initialItems: MenuItemData[];
}

interface NewDishForm {
  name: string;
  description: string;
  price: string;
  category: string;
  sides: string;
  image_url: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  sides?: string;
  image_url?: string;
  form?: string;
}
interface InlineEditState {
  field: "price" | "description" | "available_sides";
  itemId: string;
  value: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Admin CRUD interface for menu items.
 *
 * Lists all dishes (active and inactive), supports adding new dishes,
 * inline editing of price and description, and deactivation/reactivation
 * with confirmation.
 */
export { MenuEditor };
export default function MenuEditor({ initialItems }: MenuEditorProps) {
  const router = useRouter();
  const [items, setItems] = useState<MenuItemData[]>(initialItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inlineEdit, setInlineEdit] = useState<InlineEditState | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<string | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ─── New dish form state ─────────────────────────────────────────────────

  const [formData, setFormData] = useState<NewDishForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    sides: "",
    image_url: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = useCallback(
    (field: keyof NewDishForm, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const validateForm = useCallback((): FormErrors => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = "Name is required";
    } else if (formData.name.trim().length > 100) {
      errs.name = "Name cannot exceed 100 characters";
    }

    if (!formData.description.trim()) {
      errs.description = "Description is required";
    } else if (formData.description.trim().length > 500) {
      errs.description = "Description cannot exceed 500 characters";
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price.trim()) {
      errs.price = "Price is required";
    } else if (isNaN(priceNum) || priceNum <= 0) {
      errs.price = "Price must be a positive number";
    }

    if (!formData.category.trim()) {
      errs.category = "Category is required";
    }

    if (!formData.sides.trim()) {
      errs.sides = 'At least one side is required (use "None" if no sides)';
    }

    if (!formData.image_url.trim()) {
      errs.image_url = "Image URL is required";
    } else {
      try {
        new URL(formData.image_url.trim());
      } catch {
        errs.image_url = "Enter a valid URL";
      }
    }

    return errs;
  }, [formData]);

  const handleAddDish = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);
      setErrors({});

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        available_sides: formData.sides
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image_url: formData.image_url.trim(),
        is_active: true,
      };

      try {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || `Failed to add dish (${res.status})`);
        }

        // Reset form and refresh
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          sides: "",
          image_url: "",
        });
        setShowAddForm(false);
        router.refresh();
      } catch (err) {
        setErrors({
          form:
            err instanceof Error ? err.message : "Failed to add dish. Try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, router],
  );

  // ─── Inline edit handlers ────────────────────────────────────────────────

  const handleInlineEditSave = useCallback(async () => {
    if (!inlineEdit) return;

    setActionLoading(inlineEdit.itemId);

    const payload: Record<string, string | number | string[]> = {};
    if (inlineEdit.field === "price") {
      const num = parseFloat(inlineEdit.value);
      if (isNaN(num) || num <= 0) {
        setActionLoading(null);
        return;
      }
      payload.price = num;
    } else if (inlineEdit.field === "available_sides") {
      const sides = inlineEdit.value
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (sides.length === 0) {
        setActionLoading(null);
        return;
      }
      payload.available_sides = sides;
    } else {
      if (!inlineEdit.value.trim()) {
        setActionLoading(null);
        return;
      }
      payload.description = inlineEdit.value.trim();
    }

    try {
      const res = await fetch(`/api/menu/${inlineEdit.itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item._id === inlineEdit.itemId
            ? { ...item, ...payload, updated_at: new Date().toISOString() }
            : item,
        ),
      );
      setInlineEdit(null);
    } catch {
      // Silently fail — user will see stale data, can retry
    } finally {
      setActionLoading(null);
    }
  }, [inlineEdit]);

  // ─── Toggle active state ─────────────────────────────────────────────────

  const handleToggleActive = useCallback(
    async (itemId: string, currentlyActive: boolean) => {
      setActionLoading(itemId);
      setConfirmDeactivate(null);

      try {
        const res = await fetch(`/api/menu/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !currentlyActive }),
        });

        if (!res.ok) throw new Error("Toggle failed");

        setItems((prev) =>
          prev.map((item) =>
            item._id === itemId
              ? {
                ...item,
                is_active: !currentlyActive,
                updated_at: new Date().toISOString(),
              }
              : item,
          ),
        );
      } catch {
        // Could add error state per item, but for now just fail silently
      } finally {
        setActionLoading(null);
      }
    },
    [],
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  const normalizedQuery = searchQuery.toLowerCase().trim();
  const filteredItems = normalizedQuery
    ? items.filter((i) => i.name.toLowerCase().includes(normalizedQuery))
    : items;
  const activeItems = filteredItems.filter((i) => i.is_active);
  const inactiveItems = filteredItems.filter((i) => !i.is_active);

  return (
    <div className="space-y-6">
      {/* Search + Add Dish */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes by name\u2026"
            aria-label="Search dishes"
            className="w-full rounded-xl border border-glass-border bg-glass-bg py-2.5 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-text-muted hover:text-text-primary hover:bg-glass-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}
        </div>
        <Button
          variant={showAddForm ? "ghost" : "primary"}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "Add New Dish"}
        </Button>
      </div>

      {/* Add Dish Form */}
      {showAddForm && (
        <GlassCard className="p-6">
          <h3 className="font-serif text-xl font-semibold text-text-primary mb-4">
            Add New Dish
          </h3>
          <form onSubmit={handleAddDish} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Dish Name"
                name="name"
                required
                value={formData.name}
                onChange={(e) =>
                  updateField("name", (e.target as HTMLInputElement).value)
                }
                error={errors.name}
                placeholder="e.g. Goat Pepper Soup"
              />
              <Input
                label="Category"
                name="category"
                required
                value={formData.category}
                onChange={(e) =>
                  updateField("category", (e.target as HTMLInputElement).value)
                }
                error={errors.category}
                placeholder="e.g. Pepper Soup"
              />
            </div>

            <Input
              label="Description"
              name="description"
              required
              multiline
              value={formData.description}
              onChange={(e) =>
                updateField(
                  "description",
                  (e.target as HTMLTextAreaElement).value,
                )
              }
              error={errors.description}
              placeholder="A rich, aromatic pepper soup with tender goat meat\u2026"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Price (NGN)"
                name="price"
                type="number"
                inputMode="numeric"
                required
                value={formData.price}
                onChange={(e) =>
                  updateField("price", (e.target as HTMLInputElement).value)
                }
                error={errors.price}
                placeholder="5000"
              />
              <Input
                label="Available Sides (comma-separated)"
                name="sides"
                required
                value={formData.sides}
                onChange={(e) =>
                  updateField("sides", (e.target as HTMLInputElement).value)
                }
                error={errors.sides}
                placeholder="Plantain, Rice, Yam, None"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUpload
                label="Dish Photo"
                value={formData.image_url}
                onChange={(url) => updateField("image_url", url)}
              />
              {errors.image_url && (
                <p className="text-xs text-status-failed mt-1">{errors.image_url}</p>
              )}
            </div>

            {errors.form && (
              <p className="text-sm text-status-failed text-center" role="alert">
                {errors.form}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Adding dish..." : "Add Dish"}
            </Button>
          </form>
        </GlassCard>
      )}

      {/* Active Dishes */}
      {activeItems.length > 0 && (
        <section aria-label="Active dishes">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
            Active Dishes ({activeItems.length})
          </h3>
          <div className="space-y-3">
            {activeItems.map((item) => (
              <MenuItemRow
                key={item._id}
                item={item}
                inlineEdit={inlineEdit}
                setInlineEdit={setInlineEdit}
                onSaveInlineEdit={handleInlineEditSave}
                confirmDeactivate={confirmDeactivate}
                setConfirmDeactivate={setConfirmDeactivate}
                onToggleActive={handleToggleActive}
                actionLoading={actionLoading}
                setItems={setItems}
              />
            ))}
          </div>
        </section>
      )}

      {/* Inactive Dishes */}
      {inactiveItems.length > 0 && (
        <section aria-label="Inactive dishes">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
            Inactive Dishes ({inactiveItems.length})
          </h3>
          <div className="space-y-3">
            {inactiveItems.map((item) => (
              <MenuItemRow
                key={item._id}
                item={item}
                inlineEdit={inlineEdit}
                setInlineEdit={setInlineEdit}
                onSaveInlineEdit={handleInlineEditSave}
                confirmDeactivate={confirmDeactivate}
                setConfirmDeactivate={setConfirmDeactivate}
                onToggleActive={handleToggleActive}
                actionLoading={actionLoading}
                setItems={setItems}
              />
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {normalizedQuery && activeItems.length === 0 && inactiveItems.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-text-muted">
            No dishes matching &ldquo;{searchQuery.trim()}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Sides Tag Panel ────────────────────────────────────────────────────────

function SidesPanel({
  sides,
  itemId,
  onUpdate,
}: {
  sides: string[];
  itemId: string;
  onUpdate: (newSides: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newSide, setNewSide] = useState("");
  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleAdd = () => {
    const trimmed = newSide.trim();
    if (!trimmed || sides.includes(trimmed)) {
      setNewSide("");
      return;
    }
    onUpdate([...sides, trimmed]);
    setNewSide("");
    // Stay in adding mode so user can keep typing more items
  };

  const handleRemove = (side: string) => {
    const updated = sides.filter((s) => s !== side);
    if (updated.length > 0) {
      onUpdate(updated);
    }
  };

  const handleDragStart = (idx: number) => { dragIdx.current = idx; };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx.current !== null && dragIdx.current !== idx) setDragOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragIdx.current !== null && dragIdx.current !== idx) {
      const updated = [...sides];
      const [moved] = updated.splice(dragIdx.current, 1);
      updated.splice(idx, 0, moved);
      onUpdate(updated);
    }
    dragIdx.current = null;
    setDragOverIdx(null);
  };
  const handleDragEnd = () => { dragIdx.current = null; setDragOverIdx(null); };

  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label={`Side options for dish ${itemId}`}>
      {sides.map((side, idx) => (
        <span
          key={side}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={() => handleDrop(idx)}
          onDragEnd={handleDragEnd}
          className={`inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-gray-50 dark:bg-[rgba(255,255,255,0.05)] px-2.5 py-0.5 text-xs text-text-secondary cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${dragOverIdx === idx ? "ring-2 ring-brand-lemon-dark dark:ring-brand-lemon scale-105" : ""
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 opacity-30 shrink-0" aria-hidden="true">
            <path d="M6 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm6-8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
          </svg>
          {side}
          <button
            type="button"
            onClick={() => handleRemove(side)}
            aria-label={`Remove ${side}`}
            className="ml-0.5 rounded-full p-0.5 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3" aria-hidden="true">
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </svg>
          </button>
        </span>
      ))}

      {adding ? (
        <span className="inline-flex items-center gap-1">
          <input
            type="text"
            value={newSide}
            onChange={(e) => setNewSide(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") { setAdding(false); setNewSide(""); }
            }}
            placeholder="e.g. Garri"
            className="w-24 rounded-full border border-brand-lemon-dark/30 dark:border-brand-lemon/30 bg-transparent px-2.5 py-0.5 text-xs text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-full bg-brand-lemon-dark dark:bg-brand-lemon px-2 py-0.5 text-xs font-medium text-white dark:text-brand-dark hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setAdding(false); setNewSide(""); }}
            className="text-xs text-text-muted hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          aria-label="Add a new side option"
          className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-gray-300 dark:border-[rgba(255,255,255,0.15)] px-2 py-0.5 text-xs text-text-muted hover:text-brand-lemon-dark dark:hover:text-brand-lemon hover:border-brand-lemon-dark dark:hover:border-brand-lemon transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3" aria-hidden="true">
            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
          </svg>
          Add side
        </button>
      )}
    </div>
  );
}

// ─── Menu Item Row ───────────────────────────────────────────────────────────

interface MenuItemRowProps {
  item: MenuItemData;
  inlineEdit: InlineEditState | null;
  setInlineEdit: (edit: InlineEditState | null) => void;
  onSaveInlineEdit: () => void;
  confirmDeactivate: string | null;
  setConfirmDeactivate: (id: string | null) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  actionLoading: string | null;
  setItems: React.Dispatch<React.SetStateAction<MenuItemData[]>>;
}

function MenuItemRow({
  item,
  inlineEdit,
  setInlineEdit,
  onSaveInlineEdit,
  confirmDeactivate,
  setConfirmDeactivate,
  onToggleActive,
  actionLoading,
  setItems,
}: MenuItemRowProps) {
  const isEditing = inlineEdit?.itemId === item._id;
  const isLoading = actionLoading === item._id;
  const isConfirming = confirmDeactivate === item._id;

  return (
    <GlassCard
      className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${!item.is_active ? "opacity-60" : ""
        }`}
    >
      {/* Image thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-serif text-base font-semibold text-text-primary truncate">
            {item.name}
          </h4>
          {!item.is_active && (
            <span className="shrink-0 rounded-full bg-text-muted/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
              Inactive
            </span>
          )}
        </div>

        {/* Inline edit: description */}
        {isEditing && inlineEdit.field === "description" ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inlineEdit.value}
              onChange={(e) =>
                setInlineEdit({ ...inlineEdit, value: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveInlineEdit();
                if (e.key === "Escape") setInlineEdit(null);
              }}
              className="flex-1 rounded-lg border border-glass-border bg-glass-bg px-3 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
              aria-label="Edit description"
              autoFocus
            />
            <button
              type="button"
              onClick={onSaveInlineEdit}
              aria-label="Save description"
              className="rounded-lg px-2 py-1 text-xs font-medium text-brand-lemon-dark dark:text-brand-lemon transition-colors hover:bg-brand-lemon-dark/10 dark:hover:bg-brand-lemon/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setInlineEdit(null)}
              aria-label="Cancel editing"
              className="rounded-lg px-2 py-1 text-xs text-text-muted transition-colors hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="block w-full text-left text-sm text-text-secondary truncate cursor-pointer hover:text-text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:ring-offset-brand-dark rounded"
            onClick={() =>
              setInlineEdit({
                field: "description",
                itemId: item._id,
                value: item.description,
              })
            }
            title="Click to edit description"
          >
            {item.description}
          </button>
        )}

        <p className="text-xs text-text-muted mb-1">{item.category}</p>

        {/* Sides tag panel */}
        <SidesPanel
          sides={item.available_sides}
          itemId={item._id}
          onUpdate={(newSides) => {
            // Optimistic update locally
            setItems((prev) =>
              prev.map((i) =>
                i._id === item._id ? { ...i, available_sides: newSides } : i
              )
            );
            // Persist to API
            fetch(`/api/menu/${item._id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ available_sides: newSides }),
            }).catch(() => {
              // Revert on failure
              setItems((prev) =>
                prev.map((i) =>
                  i._id === item._id
                    ? { ...i, available_sides: item.available_sides }
                    : i
                )
              );
            });
          }}
        />
      </div>

      {/* Price (inline editable) */}
      <div className="shrink-0">
        {isEditing && inlineEdit.field === "price" ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inlineEdit.value}
              onChange={(e) =>
                setInlineEdit({ ...inlineEdit, value: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveInlineEdit();
                if (e.key === "Escape") setInlineEdit(null);
              }}
              className="w-24 rounded-lg border border-glass-border bg-glass-bg px-3 py-1 text-sm text-text-primary tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
              aria-label="Edit price"
              autoFocus
            />
            <button
              type="button"
              onClick={onSaveInlineEdit}
              aria-label="Save price"
              className="rounded-lg px-2 py-1 text-xs font-medium text-brand-lemon-dark dark:text-brand-lemon transition-colors hover:bg-brand-lemon-dark/10 dark:hover:bg-brand-lemon/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              setInlineEdit({
                field: "price",
                itemId: item._id,
                value: item.price.toString(),
              })
            }
            className="tabular-nums text-base font-semibold text-brand-lemon-dark dark:text-brand-lemon transition-colors hover:text-brand-lemon-dark/80 dark:hover:text-brand-lemon/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:ring-offset-brand-dark rounded-lg px-2 py-1"
            title="Click to edit price"
          >
            {formatNGN(item.price)}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant={item.is_active ? "ghost" : "secondary"}
          onClick={() => {
            if (item.is_active) {
              setConfirmDeactivate(item._id);
            } else {
              onToggleActive(item._id, item.is_active);
            }
          }}
          loading={isLoading}
          className="!px-3 !py-1.5 !text-xs"
        >
          {item.is_active ? "Deactivate" : "Reactivate"}
        </Button>
      </div>

      {/* Deactivation confirmation dialog */}
      <ConfirmDialog
        open={isConfirming}
        variant="destructive"
        title="Deactivate Dish"
        message={`Are you sure you want to deactivate "${item.name}"? It will no longer appear on the menu.`}
        confirmLabel="Deactivate"
        cancelLabel="Keep Active"
        loading={isLoading}
        onConfirm={() => onToggleActive(item._id, item.is_active)}
        onCancel={() => setConfirmDeactivate(null)}
      />
    </GlassCard>
  );
}
