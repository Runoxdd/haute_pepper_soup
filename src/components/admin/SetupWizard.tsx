"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
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

type Step = "welcome" | "details" | "pricing" | "review";

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * First-time setup wizard shown when no menu items exist.
 *
 * Guides the admin through adding their first dish with encouraging
 * messaging and a step-by-step flow: Welcome -> Details -> Pricing -> Review.
 */
export { SetupWizard };
export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "Pepper Soup",
    sides: "Plantain, Rice, Yam, None",
    image_url: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  // ─── Validation per step ─────────────────────────────────────────────────

  const validateDetails = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = "Give your dish a name";
    else if (formData.name.trim().length > 100)
      errs.name = "Name cannot exceed 100 characters";

    if (!formData.description.trim())
      errs.description = "Describe your dish so customers know what to expect";
    else if (formData.description.trim().length > 500)
      errs.description = "Description cannot exceed 500 characters";

    if (!formData.category.trim()) errs.category = "Category is required";

    return errs;
  }, [formData]);

  const validatePricing = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    const priceNum = parseFloat(formData.price);
    if (!formData.price.trim()) errs.price = "Set a price for your dish";
    else if (isNaN(priceNum) || priceNum <= 0)
      errs.price = "Price must be a positive number";

    if (!formData.sides.trim())
      errs.sides = 'Add at least one side option (use "None" if no sides)';

    if (!formData.image_url.trim()) {
      errs.image_url = "Add a photo of your dish";
    } else {
      try {
        new URL(formData.image_url.trim());
      } catch {
        errs.image_url = "Enter a valid URL for the image";
      }
    }

    return errs;
  }, [formData]);

  // ─── Step navigation ─────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (step === "details") {
      const errs = validateDetails();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setStep("pricing");
    } else if (step === "pricing") {
      const errs = validatePricing();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setStep("review");
    }
  }, [step, validateDetails, validatePricing]);

  const handleBack = useCallback(() => {
    if (step === "pricing") setStep("details");
    else if (step === "review") setStep("pricing");
  }, [step]);

  // ─── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
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
          throw new Error(
            data?.error || `Failed to create dish (${res.status})`,
          );
        }

        router.refresh();
      } catch (err) {
        setErrors({
          form:
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
        });
        setLoading(false);
      }
    },
    [formData, router],
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-xl py-8">
      {/* Welcome Step */}
      {step === "welcome" && (
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
              <svg
                className="h-8 w-8 text-brand-lemon-dark dark:text-brand-lemon"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
                />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-text-primary">
              Welcome to Haute Pepper Soup Admin
            </h1>
            <p className="text-text-secondary leading-relaxed">
              Your menu is empty right now. Let us add your first dish together
              — it only takes a minute.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setStep("details")}
            className="px-8"
          >
            Add Your First Dish
          </Button>
        </div>
      )}

      {/* Step Indicator */}
      {step !== "welcome" && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            {(["details", "pricing", "review"] as Step[]).map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                    step === s
                      ? "bg-brand-lemon-dark dark:bg-brand-lemon text-white dark:text-brand-dark"
                      : (["details", "pricing", "review"] as Step[]).indexOf(step) >
                          idx
                        ? "bg-brand-lemon-dark/20 dark:bg-brand-lemon/20 text-brand-lemon-dark dark:text-brand-lemon"
                        : "bg-glass-bg text-text-muted border border-glass-border"
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < 2 && (
                  <div
                    className={`h-0.5 w-8 rounded-full transition-colors duration-200 ${
                      (["details", "pricing", "review"] as Step[]).indexOf(step) > idx
                        ? "bg-brand-lemon-dark/40 dark:bg-brand-lemon/40"
                        : "bg-glass-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Step */}
      {step === "details" && (
        <GlassCard className="p-6 space-y-5">
          <div>
            <h2 className="font-serif text-xl font-semibold text-text-primary">
              Tell us about your dish
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              What makes your pepper soup special? Customers will see this on
              the menu.
            </p>
          </div>

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
            placeholder="A rich, aromatic pepper soup with tender goat meat, infused with traditional Nigerian spices\u2026"
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

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setStep("welcome")}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Continue
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Pricing Step */}
      {step === "pricing" && (
        <GlassCard className="p-6 space-y-5">
          <div>
            <h2 className="font-serif text-xl font-semibold text-text-primary">
              Set pricing and options
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              How much does it cost, and what sides can customers choose?
            </p>
          </div>

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

          <Input
            label="Image URL"
            name="image_url"
            type="url"
            required
            value={formData.image_url}
            onChange={(e) =>
              updateField("image_url", (e.target as HTMLInputElement).value)
            }
            error={errors.image_url}
            placeholder="https://utfs.io/f/\u2026"
          />

          <p className="text-xs text-text-muted">
            Upload your dish photo using the upload tool, then paste the URL
            here.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Continue
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Review Step */}
      {step === "review" && (
        <form onSubmit={handleSubmit}>
          <GlassCard className="p-6 space-y-5">
            <div>
              <h2 className="font-serif text-xl font-semibold text-text-primary">
                Looking great! Review your dish
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Here is what customers will see. You can always edit it later.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-glass-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-text-primary">
                    {formData.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {formData.category}
                  </p>
                </div>
                <span className="tabular-nums text-lg font-bold text-brand-lemon-dark dark:text-brand-lemon whitespace-nowrap">
                  {formData.price
                    ? `\u20A6${parseFloat(formData.price).toLocaleString("en-US")}`
                    : "---"}
                </span>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                {formData.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {formData.sides
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((side) => (
                    <span
                      key={side}
                      className="rounded-full border border-glass-border bg-glass-bg px-3 py-1 text-xs text-text-secondary"
                    >
                      {side}
                    </span>
                  ))}
              </div>

              {formData.image_url && (
                <p className="text-xs text-text-muted truncate">
                  Image: {formData.image_url}
                </p>
              )}
            </div>

            {errors.form && (
              <p
                className="text-sm text-status-failed text-center"
                role="alert"
              >
                {errors.form}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={handleBack} type="button">
                Back
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                {loading ? "Creating dish..." : "Add to Menu"}
              </Button>
            </div>
          </GlassCard>
        </form>
      )}
    </div>
  );
}
