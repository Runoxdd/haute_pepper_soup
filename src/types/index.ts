import type { ObjectId } from "mongodb";

// ─── Menu ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available_sides: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "contacted" | "completed";
export type NotificationStatus = "pending" | "sent" | "failed";

export interface OrderItem {
  menu_item_id: ObjectId;
  menu_item_name: string;
  side: string;
  quantity: number;
  unit_price: number;
}

export interface LocationMeta {
  lat: number;
  lng: number;
  place_id: string;
}

export interface Order {
  _id: ObjectId;
  reference: string;
  user_id: ObjectId | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  address: string;
  notes?: string | null;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  notification_status: NotificationStatus;
  party_service_inquiry: boolean;
  location_meta?: LocationMeta | null;
  created_at: Date;
  updated_at: Date;
}

// ─── Cart (client-side) ─────────────────────────────────────────────────────

export interface CartItem {
  menuItemId: string;
  name: string;
  side: string;
  quantity: number;
  unitPrice: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string, side: string) => void;
  updateQuantity: (menuItemId: string, side: string, quantity: number) => void;
  clearCart: () => void;
}
