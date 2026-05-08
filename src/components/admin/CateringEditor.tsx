"use client";

import { useState, useCallback, useRef, type FormEvent } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ImageUpload } from "./ImageUpload";
import { formatNGN } from "@/lib/format";

interface CateringService {
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

interface CateringEditorProps {
  initialServices: CateringService[];
}

export function CateringEditor({ initialServices }: CateringEditorProps) {
  const [services, setServices] = useState<CateringService[]>(initialServices);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState<string | null>(null);

  const serviceToDeactivate = confirmDeactivate
    ? services.find((s) => s._id === confirmDeactivate)
    : null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
            Catering Services
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your catering packages and pricing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-lemon px-5 text-sm font-semibold text-brand-dark transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Add Service
        </button>
      </div>

      {/* Add new service form */}
      {adding && (
        <ServiceForm
          onSave={(service) => {
            setServices((prev) => [...prev, { ...service, _id: `new-${Date.now()}`, sort_order: prev.length + 1 }]);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* Deactivation confirmation dialog */}
      <ConfirmDialog
        open={confirmDeactivate !== null}
        variant="destructive"
        title="Deactivate Service"
        message={
          serviceToDeactivate
            ? `Are you sure you want to deactivate "${serviceToDeactivate.name}"? It will no longer be visible to customers.`
            : ""
        }
        confirmLabel="Deactivate"
        cancelLabel="Keep Active"
        onConfirm={() => {
          if (confirmDeactivate) {
            setServices((prev) =>
              prev.map((s) =>
                s._id === confirmDeactivate
                  ? { ...s, is_active: false }
                  : s
              )
            );
          }
          setConfirmDeactivate(null);
        }}
        onCancel={() => setConfirmDeactivate(null)}
      />

      {/* Service list */}
      <div className="space-y-4">
        {services.map((service) => (
          <GlassCard
            key={service._id}
            className={`p-5 ${!service.is_active ? "opacity-60" : ""}`}
          >
            {editing === service._id ? (
              <ServiceForm
                initial={service}
                onSave={(updated) => {
                  setServices((prev) =>
                    prev.map((s) =>
                      s._id === service._id ? { ...s, ...updated } : s
                    )
                  );
                  setEditing(null);
                  // In production: PATCH /api/catering/[id]
                }}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif text-lg font-semibold text-text-primary truncate">
                      {service.name}
                    </h3>
                    {!service.is_active && (
                      <span className="rounded-full bg-gray-200 dark:bg-white/10 px-2 py-0.5 text-xs text-text-muted">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Includes tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {service.includes.map((item) => (
                      <span
                        key={item}
                        className="inline-flex rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-2.5 py-0.5 text-xs text-text-secondary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.highlights.map((item) => (
                      <span
                        key={item}
                        className="inline-flex rounded-full border border-brand-lemon-dark/20 dark:border-brand-lemon/20 bg-brand-lemon-dark/5 dark:bg-brand-lemon/5 px-2.5 py-0.5 text-xs text-brand-lemon-dark dark:text-brand-lemon"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                  <span className="tabular-nums text-lg font-bold text-brand-lemon-dark dark:text-brand-lemon whitespace-nowrap">
                    From {formatNGN(service.starting_price)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(service._id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-glass-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (service.is_active) {
                          setConfirmDeactivate(service._id);
                        } else {
                          setServices((prev) =>
                            prev.map((s) =>
                              s._id === service._id
                                ? { ...s, is_active: true }
                                : s
                            )
                          );
                        }
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon ${service.is_active
                          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          : "text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10"
                        }`}
                    >
                      {service.is_active ? "Deactivate" : "Reactivate"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── Tag Editor (pill-based list editing) ────────────────────

function TagEditor({
  tags,
  onChange,
  placeholder,
  accentClass,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  accentClass: string;
}) {
  const [adding, setAdding] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleAdd = () => {
    const trimmed = newTag.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setNewTag("");
      return;
    }
    onChange([...tags, trimmed]);
    setNewTag("");
  };

  const handleRemove = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    dragIdx.current = idx;
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx.current !== null && dragIdx.current !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDrop = (idx: number) => {
    if (dragIdx.current !== null && dragIdx.current !== idx) {
      const updated = [...tags];
      const [moved] = updated.splice(dragIdx.current, 1);
      updated.splice(idx, 0, moved);
      onChange(updated);
    }
    dragIdx.current = null;
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    dragIdx.current = null;
    setDragOverIdx(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag, idx) => (
        <span
          key={tag}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={() => handleDrop(idx)}
          onDragEnd={handleDragEnd}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${accentClass} ${dragOverIdx === idx ? "ring-2 ring-brand-lemon-dark dark:ring-brand-lemon scale-105" : ""
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 opacity-30 shrink-0" aria-hidden="true">
            <path d="M6 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm6-8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
          </svg>
          {tag}
          <button
            type="button"
            onClick={() => handleRemove(tag)}
            aria-label={`Remove "${tag}"`}
            className="ml-0.5 rounded-full p-0.5 text-current opacity-50 hover:opacity-100 hover:text-red-500 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3" aria-hidden="true">
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </svg>
          </button>
        </span>
      ))}

      {adding ? (
        <span className="inline-flex items-center gap-1.5">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); handleAdd(); }
              if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setAdding(false); setNewTag(""); }
            }}
            placeholder={placeholder}
            className="w-44 rounded-full border border-brand-lemon-dark/30 dark:border-brand-lemon/30 bg-transparent px-3 py-1 text-xs text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-full bg-brand-lemon-dark dark:bg-brand-lemon px-2.5 py-1 text-xs font-medium text-white dark:text-brand-dark hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setAdding(false); setNewTag(""); }}
            className="text-xs text-text-muted hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-gray-300 dark:border-white/15 px-2.5 py-1 text-xs text-text-muted hover:text-brand-lemon-dark dark:hover:text-brand-lemon hover:border-brand-lemon-dark dark:hover:border-brand-lemon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3" aria-hidden="true">
            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
          </svg>
          Add item
        </button>
      )}
    </div>
  );
}

// ─── Service Form ────────────────────────────────────────────

function ServiceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<CateringService>;
  onSave: (data: Omit<CateringService, "_id" | "sort_order">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [startingPrice, setStartingPrice] = useState(
    initial?.starting_price?.toString() || ""
  );
  const [imageUrl, setImageUrl] = useState(initial?.image_url || "");
  const [includes, setIncludes] = useState<string[]>(initial?.includes || []);
  const [highlights, setHighlights] = useState<string[]>(initial?.highlights || []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const price = parseFloat(startingPrice);
      if (!name.trim() || isNaN(price) || price <= 0) return;

      onSave({
        name: name.trim(),
        slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
        description: description.trim(),
        starting_price: price,
        image_url: imageUrl.trim() || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        includes,
        highlights,
        is_active: initial?.is_active ?? true,
      });
    },
    [name, slug, description, startingPrice, imageUrl, includes, highlights, initial, onSave]
  );

  return (
    <GlassCard className="p-6 mb-6">
      <h3 className="font-serif text-lg font-semibold text-text-primary mb-4">
        {initial ? "Edit Service" : "Add New Service"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="svc-name" className="block text-sm font-medium text-text-primary mb-1">
              Service Name
            </label>
            <input
              id="svc-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!initial) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
              placeholder="e.g. Birthday Parties"
              required
              className="w-full rounded-xl border border-glass-border bg-glass-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
            />
          </div>
          <div>
            <label htmlFor="svc-price" className="block text-sm font-medium text-text-primary mb-1">
              Starting Price (₦)
            </label>
            <input
              id="svc-price"
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              placeholder="e.g. 50000"
              required
              min={0}
              className="w-full rounded-xl border border-glass-border bg-glass-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon tabular-nums"
            />
          </div>
        </div>

        <div>
          <label htmlFor="svc-desc" className="block text-sm font-medium text-text-primary mb-1">
            Description
          </label>
          <input
            id="svc-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of this service"
            className="w-full rounded-xl border border-glass-border bg-glass-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
          />
        </div>

        <ImageUpload
          label="Service Photo"
          value={imageUrl}
          onChange={setImageUrl}
        />

        <div>
          <p className="block text-sm font-medium text-text-primary mb-2">
            What&rsquo;s Included
          </p>
          <TagEditor
            tags={includes}
            onChange={setIncludes}
            placeholder="e.g. Dedicated serving staff"
            accentClass="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-text-secondary"
          />
        </div>

        <div>
          <p className="block text-sm font-medium text-text-primary mb-2">
            Highlights
          </p>
          <TagEditor
            tags={highlights}
            onChange={setHighlights}
            placeholder="e.g. Perfect for 20-100 guests"
            accentClass="border-brand-lemon-dark/20 dark:border-brand-lemon/20 bg-brand-lemon-dark/5 dark:bg-brand-lemon/5 text-brand-lemon-dark dark:text-brand-lemon"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand-lemon px-5 py-2.5 text-sm font-semibold text-brand-dark transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon"
          >
            {initial ? "Save Changes" : "Add Service"}
          </button>
        </div>
      </form>
    </GlassCard>
  );
}


