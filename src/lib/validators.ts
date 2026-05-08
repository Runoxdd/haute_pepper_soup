import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared field validators
// ---------------------------------------------------------------------------

/**
 * Nigerian phone number: 11 digits starting with 0 (e.g. 08012345678)
 * or international +234 format (e.g. +2348012345678).
 */
const nigerianPhone = z
  .string()
  .trim()
  .regex(
    /^(?:0[7-9][01]\d{8}|\+234[7-9][01]\d{8})$/,
    "Enter a valid Nigerian phone number (e.g. 08012345678 or +2348012345678)",
  );

/**
 * Validates that a string looks like a 24-hex-char MongoDB ObjectId.
 */
const objectIdString = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID");

// ---------------------------------------------------------------------------
// Order schemas
// ---------------------------------------------------------------------------

const orderItemSchema = z.object({
  menu_item_id: objectIdString,
  side: z.string().trim().min(1, "Side is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
});

export const createOrderSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  customer_phone: nigerianPhone,
  customer_email: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed === "" ? undefined : trimmed;
      }
      return val;
    },
    z.string().email("Enter a valid email address").optional(),
  ),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(500, "Address cannot exceed 500 characters"),
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"),
  party_service_inquiry: z.boolean().optional().default(false),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// ---------------------------------------------------------------------------
// Menu item schemas
// ---------------------------------------------------------------------------

export const createMenuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  price: z
    .number()
    .positive("Price must be greater than zero")
    .finite("Price must be a finite number"),
  image_url: z
    .string()
    .trim()
    .url("Enter a valid image URL"),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category cannot exceed 100 characters"),
  available_sides: z
    .array(z.string().trim().min(1, "Side name cannot be empty"))
    .min(1, "At least one side option is required (use \"None\" if no sides)"),
  is_active: z.boolean().optional().default(true),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

export const updateMenuItemSchema = createMenuItemSchema.partial();

export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;

// ---------------------------------------------------------------------------
// Order status update
// ---------------------------------------------------------------------------

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "contacted", "completed"]),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ---------------------------------------------------------------------------
// Contact form schema
// ---------------------------------------------------------------------------

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
