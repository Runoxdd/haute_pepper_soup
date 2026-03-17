# Haute Pepper Soup — Design Specification

**Date**: 2026-03-17
**Status**: Approved
**Project type**: New private repository (greenfield)
**Handover**: Build for a friend, hand over the repo to a non-technical business owner

---

## 1. Project Overview

Haute Pepper Soup is a premium Nigerian pepper soup delivery website. Customers browse a curated menu, add items to a cart, and place orders. The business owner receives notifications via email (Resend) and WhatsApp, then contacts the customer to arrange payment and delivery (order-to-contact model).

### Business Context

- **Location**: Nigeria (likely Lagos)
- **Currency**: NGN (Nigerian Naira, `₦`)
- **Target audience**: Nigerian smartphone users (~80% mobile traffic)
- **Business model**: Order-to-contact — no online payment processing
- **Brand name**: Haute Pepper Soup (confirmed, final)
- **Launch menu**: 3 dishes, admin can add more over time
- **Sides**: Admin-configurable per dish (placeholder data until client provides real menu)

### Key Decisions from Planning

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth strategy | Google + Apple + Facebook OAuth (no passwords) | Eliminates bcrypt, password reset, credential stuffing. Covers 99%+ of Nigerian users. |
| Email provider | Resend (3,000/month, 100/day free) | Web3Forms only allows 250/month — exceeded by day 25 at 10 orders/day |
| WhatsApp role | Post-order contact only | Pre-fills "I placed order HP-XXXX". NOT an ordering channel. Avoids dual-channel confusion. |
| Payment | None (order-to-contact) | Owner contacts customer after order to arrange payment/delivery |
| Glassmorphism | Progressive enhancement | `@supports backdrop-filter` for high-end devices; solid dark cards on budget Android |
| Hosting | Railway (free tier allows commercial use) | Vercel Hobby plan prohibits commercial use; Railway has no such restriction |
| Database tier | MongoDB Atlas M0 free (always-on) | Avoids cold-start issues |
| Guest ordering | Yes, guest-first | Anyone can order without an account. Optional signup for order history. |

---

## 2. Architecture

### 2.1 Tech Stack

| Layer | Technology | Version/Tier |
|-------|-----------|-------------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS | 4.x (CSS-first config via `@theme` directives, no `tailwind.config.ts`) |
| Animation | Motion (formerly Framer Motion) | Latest (import from `motion/react`) |
| State | Zustand + `persist` middleware | localStorage backend |
| Auth | Auth.js (NextAuth v5) | Google, Apple, Facebook providers. Root `auth.ts` config pattern. |
| Database | MongoDB Atlas | M0 free tier (shared, always-on) |
| ORM/Driver | MongoDB native driver (`mongodb`) | With Zod validation (no Mongoose) |
| Email | Resend | Free tier (3,000/month, 100/day hard cap) |
| Validation | Zod | All API inputs |
| Rate limiting | Upstash Redis | Via Next.js Middleware (500K commands/month free) |
| Image storage | Uploadthing | 2GB free tier (Railway-compatible, no Vercel dependency) |
| Image optimization | next/image + Sharp | Auto WebP, responsive sizes (Sharp for self-hosted Next.js) |
| Monitoring | Sentry | Free tier, email alerts |
| Analytics | PostHog | Free tier (1M events/month, privacy-focused) |
| Package manager | pnpm | Node 20 LTS |
| Deployment | Railway | Auto-deploy on git push, commercial use allowed on free tier |

### 2.2 Folder Structure

```
haute-pepper-soup/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx           # Google/Apple/Facebook sign-in
│   │   ├── (main)/
│   │   │   ├── page.tsx               # Landing — hero + featured dishes
│   │   │   └── menu/
│   │   │       └── page.tsx           # Full menu gallery
│   │   ├── order/
│   │   │   └── [reference]/
│   │   │       └── page.tsx           # Order confirmation + guest lookup
│   │   ├── account/
│   │   │   └── orders/
│   │   │       └── page.tsx           # User order history (authenticated)
│   │   ├── admin/
│   │   │   ├── page.tsx               # Dashboard (orders today, revenue, alerts)
│   │   │   ├── menu/
│   │   │   │   └── page.tsx           # CRUD dishes, upload images, manage sides
│   │   │   └── orders/
│   │   │       └── page.tsx           # Paginated orders, filters, mark contacted
│   │   ├── privacy/
│   │   │   └── page.tsx               # Privacy policy
│   │   ├── terms/
│   │   │   └── page.tsx               # Terms of service
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts       # Auth.js v5 handler (exports { GET, POST } from auth.ts)
│   │   │   ├── menu/
│   │   │   │   ├── route.ts           # GET (public), POST (admin)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts       # PATCH, DELETE (admin, soft-delete)
│   │   │   ├── orders/
│   │   │   │   └── route.ts           # POST (public, rate-limited)
│   │   │   ├── admin/
│   │   │   │   └── orders/
│   │   │   │       ├── route.ts       # GET (admin, paginated)
│   │   │   │       └── [id]/
│   │   │   │           └── route.ts   # PATCH (admin, update status)
│   │   │   ├── user/
│   │   │   │   └── orders/
│   │   │   │       └── route.ts       # GET (authenticated user)
│   │   │   └── upload/
│   │   │       └── route.ts           # PUT (admin, Uploadthing)
│   │   ├── layout.tsx                 # Root layout, global styles, footer
│   │   ├── not-found.tsx              # Custom 404
│   │   ├── error.tsx                  # Global error boundary
│   │   └── manifest.ts               # PWA manifest
│   ├── components/
│   │   ├── menu/
│   │   │   ├── DishCard.tsx           # Animated dish card with glass effect
│   │   │   ├── MenuGallery.tsx        # Grid/scroll layout for dishes
│   │   │   └── SideSelector.tsx       # Side option picker (admin-configured options)
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx         # Slide-out cart panel
│   │   │   ├── CartItem.tsx           # Line item with quantity controls
│   │   │   └── OrderForm.tsx          # Name, phone, email, address, notes, catering
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx          # Progressive glassmorphism wrapper
│   │   │   ├── Button.tsx             # Branded button with motion
│   │   │   ├── Input.tsx              # Styled input with validation states
│   │   │   └── WhatsAppButton.tsx     # Floating WhatsApp contact button
│   │   ├── admin/
│   │   │   ├── DashboardStats.tsx     # Today's orders, revenue, pending count
│   │   │   ├── MenuEditor.tsx         # CRUD interface for dishes
│   │   │   ├── ImageUploader.tsx      # Uploadthing upload with preview
│   │   │   ├── OrderTable.tsx         # Paginated order list with filters
│   │   │   └── SetupWizard.tsx        # First-time setup when DB is empty
│   │   └── layout/
│   │       ├── Header.tsx             # Navigation, cart icon, auth state
│   │       └── Footer.tsx             # Contact info, WhatsApp, hours, Instagram, legal links
│   ├── lib/
│   │   ├── mongodb.ts                 # DB connection singleton
│   │   ├── store.ts                   # Zustand cart store with persist middleware
│   │   ├── auth.ts                    # Auth.js v5 config (exports auth, signIn, signOut, handlers)
│   │   ├── resend.ts                  # Email sending via Resend
│   │   ├── validators.ts             # Zod schemas for all API inputs
│   │   ├── format.ts                  # NGN currency formatter, date formatter
│   │   ├── references.ts             # Order reference generator (HP-XXXXX)
│   │   └── admin.ts                   # Admin email check (case-insensitive, trimmed)
│   ├── types/
│   │   └── index.ts                   # Shared TypeScript interfaces
│   └── styles/
│       └── globals.css                # Tailwind directives, glassmorphism, custom scrollbar
├── scripts/
│   └── seed.ts                        # Development seed script (pnpm seed)
├── public/
│   ├── dishes/                        # Placeholder Unsplash images
│   ├── favicon.ico
│   └── apple-touch-icon.png
├── next.config.ts
├── .env.example                       # All env vars documented
├── docs/
│   └── DEPLOYMENT.md                  # Step-by-step Railway deployment guide
└── README.md
```

---

## 3. Data Model

### 3.1 Collections

#### `users` (managed by NextAuth MongoDB Adapter)

| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Auto-generated |
| name | string | From OAuth provider |
| email | string | Unique index, from OAuth |
| emailVerified | Date | null | From NextAuth |
| image | string | null | Avatar URL from OAuth |

**Indexes**: `{ email: 1 }` (unique)

#### `menu_items`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | auto | |
| name | string | yes | e.g., "Goat Pepper Soup" |
| description | string | yes | Short dish description |
| price | number | yes | In Naira (e.g., 5000 = ₦5,000) |
| image_url | string | yes | Uploadthing URL or placeholder |
| category | string | yes | e.g., "Pepper Soup", "Sides" |
| available_sides | string[] | yes | Admin-configurable, e.g., ["Boiled Yam", "Plantain", "None"] |
| is_active | boolean | yes | Default true. Soft-delete sets false. |
| created_at | Date | auto | |
| updated_at | Date | auto | |

**Indexes**: `{ category: 1 }`, `{ is_active: 1 }`

#### `orders`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | auto | |
| reference | string | auto | Human-readable, e.g., "HP-7291". Unique. |
| user_id | ObjectId | null | no | Null for guest orders |
| customer_name | string | yes | Required even for authenticated users |
| customer_phone | string | yes | Nigerian format validated |
| customer_email | string | no | Optional for guests, pre-filled if logged in |
| address | string | yes | Plain text, max 500 chars |
| notes | string | no | Delivery instructions, max 500 chars |
| items | OrderItem[] | yes | Embedded array (denormalized for performance) |
| total_price | number | auto | **Server-calculated**, never from client |
| status | string | auto | `pending` | `contacted` | `completed` |
| notification_status | string | auto | `pending` | `sent` | `failed` |
| party_service_inquiry | boolean | no | Default false |
| location_meta | object | null | no | Reserved for future Google Maps: `{ lat, lng, place_id }` |
| created_at | Date | auto | |
| updated_at | Date | auto | |

**Embedded `items` array** (denormalized — each item is a snapshot at order time):

| Field | Type | Notes |
|-------|------|-------|
| menu_item_id | ObjectId | Reference to original menu item |
| menu_item_name | string | Snapshot of name at order time (survives soft-delete) |
| side | string | Selected side, or "None" |
| quantity | number | Positive integer, 1-100 |
| unit_price | number | Snapshot of price at order time |

**Indexes**: `{ reference: 1 }` (unique), `{ user_id: 1, created_at: -1 }`, `{ status: 1 }`, `{ notification_status: 1 }`, `{ created_at: -1 }`

**Design note**: Items are embedded (not a separate collection) because orders are immutable after creation and always read with their items. This avoids joins and matches MongoDB best practices for one-to-few relationships.

### 3.2 Order Reference Generation

Format: `HP-XXXXX` where XXXXX is a random 5-digit number (00000-99999).

```typescript
function generateReference(): string {
  const num = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `HP-${num}`;
}
```

100,000 possible values. On collision (duplicate reference), retry up to 3 times with a new random number. By the birthday problem, collisions start appearing around ~400 orders — the retry mechanism handles this gracefully. At very high order volumes (10,000+), consider switching to a date-prefixed format like `HP-0317-XXXX`.

---

## 4. API Surface

### 4.1 Public Endpoints

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| GET | `/api/menu` | Public | None | Fetch all active menu items (`is_active: true`) |
| POST | `/api/orders` | Public | 5/hr/IP | Submit order (Zod validated, server-side price calc) |
| GET | `/api/auth/[...nextauth]` | Public | 10/min/IP | NextAuth handlers |
| POST | `/api/auth/[...nextauth]` | Public | 10/min/IP | NextAuth handlers |

### 4.2 Authenticated Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/user/orders` | User | Fetch personal order history (paginated) |

### 4.3 Admin Endpoints

All admin endpoints require: authenticated session + email in `ADMIN_EMAILS` env var.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/menu` | Create new menu item (Zod validated) |
| PATCH | `/api/menu/[id]` | Update menu item (Zod validated) |
| DELETE | `/api/menu/[id]` | Soft-delete (`is_active: false`) |
| GET | `/api/admin/orders` | Paginated orders with date/status filters |
| PATCH | `/api/admin/orders/[id]` | Update order status (mark contacted/completed) |
| PUT | `/api/upload` | Upload image via Uploadthing (2MB max, JPEG/PNG/WebP, rate-limited 20/hr) |
| POST | `/api/admin/orders/[id]/resend` | Resend email notification for a specific order |

### 4.4 Request/Response Schemas

#### POST `/api/orders` — Create Order

**Request body** (Zod validated):
```typescript
{
  customer_name: string,        // min 1, max 100
  customer_phone: string,       // Nigerian phone format
  customer_email?: string,      // valid email if provided
  address: string,              // min 1, max 500
  notes?: string,               // max 500
  party_service_inquiry?: boolean,
  items: [
    {
      menu_item_id: string,     // valid ObjectId
      side: string,             // must exist in menu item's available_sides
      quantity: number           // integer, 1-100
    }
  ]
}
```

**Server-side processing**:
1. Validate all fields with Zod
2. Look up each `menu_item_id` in MongoDB — verify exists and `is_active: true`
3. Verify each `side` is in the menu item's `available_sides` array
4. Calculate `total_price = sum(item.price * item.quantity)` — ignore any client-submitted total
5. Generate unique reference (`HP-XXXX`)
6. Save order with embedded item snapshots (name + price at time of order)
7. Send Resend email to `ADMIN_EMAILS` with order details
8. Set `notification_status: sent` or `failed` based on email result
9. Return `{ reference, total_price }`

**Response**: `201 Created`
```typescript
{
  reference: "HP-7291",
  total_price: 15000
}
```

#### GET `/api/admin/orders` — Admin Order List

**Query params**:
- `page` (default 1)
- `limit` (default 20, max 100)
- `status` (optional: `pending` | `contacted` | `completed`)
- `date_from` (optional: ISO date string)
- `date_to` (optional: ISO date string)
- `notification_status` (optional: `failed` — for unnotified orders)
- `search` (optional: string — searches reference, customer_name, customer_phone)

**Response**: `200 OK`
```typescript
{
  orders: Order[],
  total: number,
  page: number,
  totalPages: number
}
```

---

## 5. Security

### 5.1 Authentication

- **Provider**: Auth.js v5 with Google, Apple, Facebook OAuth providers
- **Config pattern**: Root `auth.ts` file exporting `{ auth, handlers, signIn, signOut }`
- **Route handler**: `app/api/auth/[...nextauth]/route.ts` exports `{ GET, POST }` from `auth.ts` handlers
- **Session strategy**: JWT (stateless, no DB session table needed)
- **Session maxAge**: 7 days
- **No email/password auth**: Eliminates bcrypt, password reset, credential stuffing
- **AUTH_SECRET**: Generated via `openssl rand -base64 32` (Auth.js v5 uses `AUTH_` prefix)

### 5.2 Admin Authorization

```typescript
// lib/admin.ts
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.trim().toLowerCase());
}
```

- Case-insensitive, whitespace-trimmed comparison
- Supports multiple admin emails (comma-separated)
- Applied via Next.js Middleware on `/admin/*` routes and admin API endpoints

### 5.3 Input Validation

- **Zod** schemas on every API endpoint that accepts user input
- Max lengths: address 500, notes 500, name 100
- Quantity: positive integer, 1-100
- Side: must exist in menu item's `available_sides` array
- Phone: Nigerian format validation (11 digits starting with 0, or +234)
- Email: standard email format if provided
- All string inputs trimmed

### 5.4 CSRF Protection

- Check `Origin` header on all state-mutating endpoints (POST, PATCH, DELETE, PUT)
- Compare against allowlist: the app's primary domain + any `ALLOWED_ORIGINS` env var entries
- On Railway, check against both custom domain and Railway-assigned URL
- Implemented in Next.js Middleware

### 5.5 Rate Limiting

- **Provider**: Upstash Redis via `@upstash/ratelimit` (500K commands/month free)
- **Order endpoint** (`POST /api/orders`): 5 requests per hour per IP
- **Auth endpoints**: 10 requests per minute per IP
- **Upload endpoint** (`PUT /api/upload`): 20 requests per hour per admin session
- **Order lookup** (`GET /order/[reference]`): 30 requests per minute per IP (prevents reference enumeration)
- Implemented in Next.js Middleware
- Returns `429 Too Many Requests` with `Retry-After` header

### 5.6 Image Upload Security

- Max file size: 2MB
- Accepted types: `image/jpeg`, `image/png`, `image/webp`
- Validated via file header (magic bytes), not just Content-Type
- Stored in Uploadthing (isolated CDN, no direct server storage)
- Rate-limited to 20 uploads/hour per admin session

---

## 6. Frontend Design

### 6.1 Design System

#### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `brand-dark` | `#0A0A0A` | Page background, cinematic base |
| `brand-lemon` | `#D1FF00` | Primary CTAs ("Add to Order", "Place Order") |
| `brand-purple` | `#7B2CBF` | Hover states, gradients, secondary accents |
| `glass-bg` | `rgba(255,255,255,0.05)` | Card backgrounds (with backdrop-blur on supported devices) |
| `glass-border` | `rgba(255,255,255,0.1)` | Card borders |
| `text-primary` | `#FFFFFF` | Headings, primary text |
| `text-secondary` | `rgba(255,255,255,0.6)` | Descriptions, secondary text |

#### Typography

- **Headers**: Distinctive serif font (loaded via `next/font`, preloaded). Luxury feel.
- **Body**: Clean sans-serif. Readability on small screens.
- **Prices**: Monospace with `font-variant-numeric: tabular-nums` for alignment
- **Loading states**: End with `...` (e.g., "Placing order...")

Exact font choices to be determined during implementation — must avoid generic AI fonts (Inter, Roboto, Arial). Will select distinctive, characterful options.

#### Progressive Glassmorphism

```css
/* High-end devices */
@supports (backdrop-filter: blur(12px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* Budget devices (fallback) */
.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

Blur reduced from original 20px to 12px for better GPU performance while maintaining the frosted effect.

#### Motion

- `prefers-reduced-motion`: Disables all Motion animations
- Scroll-reveal on dish cards: `opacity 0→1`, `y 30→0`, `scale 0.95→1` (800ms, ease-out)
- Hover on dish images: `scale 1→1.05` (300ms)
- Page transitions: Fade (200ms)
- Button tap: `scale 0.97` (100ms)
- No `transition: all` — list properties explicitly
- `will-change: transform` on animated elements
- Animations interruptible (respond to user input mid-animation)

### 6.2 Mobile-First Responsive

- **Mobile** (default): Single column, full-width cards, bottom-sheet cart
- **Tablet** (768px+): 2-column menu grid
- **Desktop** (1024px+): 3-column menu grid, side drawer cart
- `touch-action: manipulation` on interactive elements (prevents double-tap delay)
- `-webkit-tap-highlight-color` set intentionally
- Safe area insets for notched devices: `env(safe-area-inset-*)`

### 6.3 Accessibility

- Semantic HTML (`<button>`, `<a>`, `<label>`, `<nav>`, `<main>`, `<footer>`)
- Icon-only buttons have `aria-label`
- Form inputs have associated `<label>` elements
- Focus states: `focus-visible:ring-2 ring-brand-lemon ring-offset-2 ring-offset-brand-dark`
- Heading hierarchy: `h1` → `h6` (no skipping)
- Skip link to main content
- Images have descriptive `alt` text
- Color contrast: WCAG AA minimum (4.5:1 for text on dark background)
- `aria-live="polite"` for toast notifications and async updates

### 6.4 States (Every Component)

| State | Treatment |
|-------|-----------|
| **Loading** | Skeleton shimmer cards (menu), spinner overlay (order submission) |
| **Empty** | Contextual message + CTA ("No dishes yet. Check back soon!") |
| **Error** | Inline error with retry button + human-readable message |
| **Image fallback** | Colored placeholder with dish initial letter on load failure |
| **Offline/network error** | "Connection lost. Your cart is saved. Tap to retry." |

---

## 7. Component Architecture

### 7.1 Server Components (default)

- `MenuGallery` — fetches dishes server-side, ISR cached
- `DashboardStats` — admin stats, SSR
- `OrderTable` — admin orders, SSR with pagination
- All page layouts

### 7.2 Client Components (`'use client'`)

- `DishCard` — Motion animations, "Add to Cart" interaction
- `SideSelector` — interactive side picker
- `CartDrawer` — Zustand state, open/close animation
- `CartItem` — quantity controls
- `OrderForm` — form state, validation, submission
- `WhatsAppButton` — floating button with dynamic href
- `ImageUploader` — drag-and-drop, preview
- `MenuEditor` — admin CRUD forms
- `SetupWizard` — first-time setup flow

### 7.3 Cart Store (Zustand)

```typescript
interface CartItem {
  menuItemId: string;
  name: string;
  side: string;       // normalized: lowercase, trimmed, or "none"
  quantity: number;
  unitPrice: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;  // merges duplicates
  removeItem: (menuItemId: string, side: string) => void;
  updateQuantity: (menuItemId: string, side: string, quantity: number) => void;
  clearCart: () => void;
  // totalPrice and totalItems are computed via selectors, not store methods
  // Usage: const total = useCartStore(s => s.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0))
}
```

**Merge logic**: When adding an item, merge key is `${menuItemId}_${side.toLowerCase().trim()}`. If key exists, increment quantity. Otherwise, add new line item.

**Persistence**: `zustand/middleware` `persist` with `name: 'haute-pepper-cart'` in localStorage. Cart survives page refresh and browser close — critical for flaky Nigerian mobile connections.

---

## 8. Order Flow (End-to-End)

```
Customer                    Frontend                     Backend                      Owner
   |                           |                            |                           |
   |-- Browse menu ----------->|                            |                           |
   |                           |-- GET /api/menu (ISR) ---->|                           |
   |                           |<-- Menu items -------------|                           |
   |<-- Render menu gallery ---|                            |                           |
   |                           |                            |                           |
   |-- Add "Goat + Plantain" ->|                            |                           |
   |                           |-- Zustand + localStorage   |                           |
   |                           |                            |                           |
   |-- Open cart, fill form -->|                            |                           |
   |                           |                            |                           |
   |-- "Place Order" -------->|                            |                           |
   |                           |-- POST /api/orders ------->|                           |
   |                           |                            |-- Zod validate            |
   |                           |                            |-- Lookup menu prices      |
   |                           |                            |-- Calculate total (server) |
   |                           |                            |-- Generate HP-XXXX        |
   |                           |                            |-- Save to MongoDB         |
   |                           |                            |-- Send Resend email ------+-->|
   |                           |                            |-- Set notification_status |   |
   |                           |<-- { reference, total } ---|                           |   |
   |<-- Redirect /order/HP-7291|                            |                           |   |
   |                           |                            |                           |   |
   |-- See confirmation ------>|                            |                           |   |
   |   (reference, summary,    |                            |                           |   |
   |    WhatsApp contact btn)  |                            |                           |   |
   |                           |                            |                           |   |
   |-- Click WhatsApp -------->| Opens wa.me with pre-filled:                           |   |
   |                           | "Hi, I placed order HP-7291                            |   |
   |                           |  on Haute Pepper Soup"     |                           |   |
   |                           |                            |                           |   |
   |                           |                            |                    Owner sees email
   |                           |                            |                    with full details
   |                           |                            |                           |
   |                           |                            |              Owner marks "Contacted"
   |                           |                            |<-- PATCH /admin/orders/id-|
```

### Guest Order Lookup

Guests can look up their order at `/order/[reference]` by entering their reference number AND the phone number used when ordering (two-factor lookup to prevent reference enumeration). This page is public (no auth required). The page shows order summary, status, and the WhatsApp contact button. Rate-limited to 30 lookups/min/IP.

---

## 9. Admin Panel

### 9.1 Dashboard (`/admin`)

**Non-technical owner UX**: Large text, big tap targets, clear labels, no jargon.

- **Today's Orders**: Count + total revenue
- **Pending Orders**: Count (orders not yet marked "contacted")
- **UNNOTIFIED ORDERS**: Red warning banner if any orders have `notification_status: "failed"` — with a "Resend All" button
- **Quick Actions**: "View Orders", "Edit Menu"

### 9.2 Menu Management (`/admin/menu`)

- List all dishes (active and inactive, inactive shown greyed out)
- **Add Dish**: Name, description, price (₦), category, image upload, sides configuration
- **Edit Dish**: Inline editing for price and description. Click to expand for full edit.
- **Image Upload**: Drag-and-drop or click, 2MB max, shows preview before saving
- **Manage Sides**: Per-dish side configuration. Add/remove sides from a text input.
- **Deactivate Dish**: Toggle `is_active` (soft-delete). Confirms before deactivating.
- **Reactivate Dish**: Toggle back to active

### 9.3 Order Management (`/admin/orders`)

- **Order List**: Paginated (20 per page), newest first
- **Filter Tabs**: All | Pending | Contacted | Completed
- **Date Range Filter**: From/to date pickers
- **Search**: By reference number or customer name/phone
- **Order Row**: Reference, customer name, phone, item count, total, status badge, time ago
- **Actions per Order**:
  - "Mark Contacted" (changes status `pending` → `contacted`)
  - "Mark Completed" (changes status `contacted` → `completed`)
  - "Resend Notification" (re-sends Resend email)
  - Expand to see full order details (items, address, notes)

### 9.4 First-Time Setup Wizard

When the database has zero menu items, the admin panel shows a setup wizard:

1. "Welcome to Haute Pepper Soup Admin"
2. "Let's add your first dish" — guided form
3. "Add more dishes or go to dashboard"

This replaces the need for the seed script for the business owner. The seed script (`pnpm seed`) is for developer use during development only.

---

## 10. SEO & Marketing

### 10.1 Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Haute Pepper Soup",
  "servesCuisine": "Nigerian",
  "menu": {
    "@type": "Menu",
    "hasMenuSection": [...]
  }
}
```

### 10.2 Metadata (Next.js Metadata API)

- Dynamic `<title>` and `<meta description>` per page
- Open Graph images (hero dish photo)
- Twitter Card meta
- Canonical URLs

### 10.3 Sitemap & Robots

- `next-sitemap` for automatic generation
- `robots.txt` allowing all crawlers
- `/admin/*` excluded from sitemap

---

## 11. Legal & Compliance

### 11.1 Nigeria Data Protection Act (NDPA) 2023

The site collects personal data (name, email, phone, address). Required:

- **Privacy Policy page** (`/privacy`): What data is collected, why, how it's stored, who has access
- **Terms of Service page** (`/terms`): Usage terms, order terms, liability
- **Google OAuth**: Requires privacy policy URL in Google Cloud Console

### 11.2 Cookie Consent

PostHog can be configured for cookieless tracking mode — no cookie consent banner needed unless other tracking is added later.

---

## 12. Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.5s on 3G | ISR for menu, next/image, font preload |
| FID (First Input Delay) | < 100ms | Minimal client JS, code splitting |
| CLS (Cumulative Layout Shift) | < 0.1 | Explicit image dimensions, font-display: optional (prevents swap reflow) |
| Lighthouse Mobile Score | > 90 | Progressive glassmorphism, reduced motion |
| Bundle size (First Load JS) | < 100KB | Dynamic imports for Motion, admin code |
| Menu page TTFB | < 500ms | ISR, M0 always-on (no cold start) |

### Performance Strategies

- **Menu page**: ISR with `revalidate: 60`. Admin mutation endpoints (`POST/PATCH/DELETE /api/menu`) call `revalidatePath('/menu')` after successful writes for immediate updates.
- **Note on Next.js 16 caching**: fetch is NOT cached by default (changed in Next.js 15). Explicit `cache: 'force-cache'` or `revalidate` is needed where caching is desired. This simplifies reasoning — only cache what you explicitly opt into.
- **Images**: `next/image` with `sizes` prop, automatic WebP via Sharp, lazy loading below fold
- **Fonts**: `next/font` with preload, `font-display: optional` (prevents CLS from font swap)
- **Code splitting**: Admin panel loaded only for admin users (`next/dynamic`)
- **Motion**: Dynamic import to keep initial bundle small (`import('motion/react')`)
- **Content-visibility**: `auto` on below-fold menu items for rendering performance

---

## 13. Currency Formatting

```typescript
// lib/format.ts
export function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}
```

Uses `₦` (U+20A6) directly instead of `Intl.NumberFormat` with `currency: 'NGN'` — avoids inconsistent `NGN` vs `₦` rendering across browsers. Tested on Chrome, Samsung Internet, and Opera Mini.

Examples: `formatNGN(5000)` → `₦5,000`, `formatNGN(15000)` → `₦15,000`

---

## 14. Environment Variables

### Complete `.env.example`

```bash
# ═══════════════════════════════════════
# Auth (Auth.js v5)
# ═══════════════════════════════════════
AUTH_URL=http://localhost:3000
AUTH_SECRET=               # Generate: openssl rand -base64 32

# Google OAuth (console.cloud.google.com)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Apple OAuth (developer.apple.com) — OPTIONAL, requires $99/year dev account
APPLE_SERVICES_ID=
APPLE_PRIVATE_KEY=         # JWT generated from Apple private key

# Facebook OAuth (developers.facebook.com)
AUTH_FACEBOOK_ID=
AUTH_FACEBOOK_SECRET=

# ═══════════════════════════════════════
# Database
# ═══════════════════════════════════════
MONGODB_URI=               # MongoDB Atlas M0 connection string (500 connections max)

# ═══════════════════════════════════════
# Admin
# ═══════════════════════════════════════
ADMIN_EMAILS=owner@gmail.com   # Comma-separated, case-insensitive

# ═══════════════════════════════════════
# Notifications
# ═══════════════════════════════════════
RESEND_API_KEY=            # From resend.com (3,000/month, 100/day hard cap)
RESEND_FROM_EMAIL=orders@hautepeppersoup.com  # Or onboarding@resend.dev before domain verification
NEXT_PUBLIC_WHATSAPP_NUMBER=234XXXXXXXXXX   # Nigerian format, no +

# ═══════════════════════════════════════
# Image Upload
# ═══════════════════════════════════════
UPLOADTHING_TOKEN=         # From uploadthing.com dashboard

# ═══════════════════════════════════════
# Rate Limiting
# ═══════════════════════════════════════
UPSTASH_REDIS_REST_URL=    # From upstash.com (500K commands/month free)
UPSTASH_REDIS_REST_TOKEN=

# ═══════════════════════════════════════
# CSRF
# ═══════════════════════════════════════
ALLOWED_ORIGINS=           # Comma-separated, e.g., https://hautepeppersoup.com,https://haute-pepper-soup.up.railway.app

# ═══════════════════════════════════════
# Monitoring (optional for development)
# ═══════════════════════════════════════
NEXT_PUBLIC_SENTRY_DSN=    # From sentry.io
NEXT_PUBLIC_POSTHOG_KEY=   # From posthog.com (1M events/month free)
NEXT_PUBLIC_POSTHOG_HOST=  # https://us.i.posthog.com or eu equivalent
```

---

## 15. Deployment & Handover

### 15.1 Deployment Checklist

1. Create private GitHub repo `haute-pepper-soup`
2. Deploy to Railway (connect GitHub repo, select Next.js template)
3. Set all environment variables in Railway dashboard
4. MongoDB Atlas: whitelist `0.0.0.0/0` (Railway uses dynamic IPs)
5. Google Cloud Console: add Railway domain to OAuth redirect URIs
6. Apple Developer: configure Sign in with Apple for the domain (if implementing)
7. Facebook Developer: add Railway domain to app settings
8. Resend: verify sending domain or use default (`onboarding@resend.dev`)
9. Upstash: create Redis database, copy credentials
10. Uploadthing: create project, copy token
11. Run `pnpm seed` locally to populate initial menu items (or use admin setup wizard)
12. Verify: place a test order, check email arrives, check admin panel

### 15.2 Handover Documentation

**README.md** includes:
- What the app does (one paragraph)
- How to run locally (`pnpm install && pnpm dev`)
- Link to `docs/DEPLOYMENT.md` for production setup

**docs/DEPLOYMENT.md** includes:
- Step-by-step with screenshots for each service setup
- MongoDB Atlas account creation + network access
- Google/Apple/Facebook OAuth app creation
- Resend account + API key + domain verification
- Upstash Redis creation
- Uploadthing project setup
- Railway deployment + env var configuration
- Domain setup (if custom domain)
- "How to change the admin email" instructions
- "How to redeploy after making changes" instructions
- Troubleshooting common issues

### 15.3 For the Non-Technical Owner

The admin panel is designed so the owner never needs to touch code, terminal, or Vercel dashboard for day-to-day operations:

- **Add/edit/remove dishes**: Admin panel
- **View/manage orders**: Admin panel
- **Upload images**: Admin panel (drag-and-drop)
- **Change prices**: Admin panel (inline edit)

The only actions requiring developer help:
- Changing the admin email
- Adding a custom domain
- Upgrading to paid tiers if needed

---

## 16. Risk Register (Updated)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Budget Android glassmorphism lag | Medium (janky UI) | High | Progressive enhancement with `@supports` fallback |
| Resend 3,000/month + 100/day quota | Medium (emails stop) | Low (early days) | Monitor send count, admin warning at 80%. Daily cap: warn admin if >80 orders in a day. |
| MongoDB M0 storage limit (512MB) | Low (data cap) | Low | Text-only orders are tiny; images in Uploadthing |
| Order spam/abuse | High (inbox flood) | Medium | Rate limiting 5/hr/IP via Upstash |
| Google OAuth approval delay | Medium (launch delay) | Medium | Start OAuth app creation early; use test mode initially |
| Apple Sign In complexity | Low (implementation) | Medium | Can defer to Phase 2 if blocking launch |
| Owner locked out of admin | High (business stops) | Low | Multi-email support, documented recovery process |
| Railway free tier limits | Low (usage cap) | Low | $5 credit/month; upgrade to Hobby ($5/month) for unlimited runtime |

---

## 17. Phased Delivery (Updated)

### Phase 1: Visual Identity + Core Infrastructure (Week 1)

**Done looks like**: Landing page with 3 placeholder dishes, glassmorphism styling, cart functionality (add/remove/persist), mobile-responsive layout.

**Includes**: Next.js 16 setup, Tailwind 4.x CSS config, Zustand cart with persist, menu gallery component, DishCard with Motion animations, Footer with contact info, custom 404/error pages, PWA manifest.

### Phase 2: Backend + Admin (Week 2)

**Done looks like**: MongoDB connected, admin panel functional (CRUD dishes, image upload, side management), Zod validation on all endpoints, rate limiting active.

**Includes**: MongoDB connection (native driver), all API routes, Zod schemas, admin middleware, Uploadthing image upload, Upstash rate limiting, CSRF protection, seed script.

### Phase 3: Orders + Auth + Notifications (Week 3)

**Done looks like**: Full order flow working end-to-end. Auth via Google (Apple/Facebook if ready). Resend emails sending. Order confirmation page with reference. Admin order dashboard.

**Includes**: Auth.js v5 setup (Google + Facebook; Apple if $99 dev account available), order submission flow, server-side price calculation, Resend integration, order confirmation page, WhatsApp post-order button, admin order management, guest order lookup (reference + phone two-factor).

### Phase 4: Polish + Handover (Week 4)

**Done looks like**: SEO implemented, privacy/terms pages, Sentry monitoring, Vercel Analytics, deployment documentation complete, repo transferred.

**Includes**: SEO structured data, meta tags, sitemap, legal pages, Sentry setup, PostHog analytics, `DEPLOYMENT.md` with screenshots, Railway deployment, final testing on budget Android device, handover.

---

## Appendix A: Reviewer Findings Disposition

The following findings from the Opus hostile review were addressed in this spec:

| # | Finding | Severity | Disposition |
|---|---------|----------|------------|
| 1 | No rate limiting | CRITICAL | Added: Upstash, 5/hr/IP on orders |
| 2 | No CSRF protection | CRITICAL | Added: Origin header check in middleware |
| 3 | Brittle admin auth | CRITICAL | Added: Case-insensitive, trimmed, multi-email |
| 4 | No input validation | CRITICAL | Added: Zod on all endpoints |
| 5 | Silent email failures | CRITICAL | Added: notification_status, retry, admin banner |
| 6 | Web3Forms 250/month | CRITICAL | Replaced: Resend (3,000/month) |
| 7 | No password reset | HIGH | Resolved: Dropped email/password auth entirely |
| 8 | No order confirmation | HIGH | Added: HP-XXXXX reference (5-digit), confirmation page |
| 9 | Ambiguous WhatsApp | HIGH | Resolved: Post-order contact only |
| 10 | No MongoDB indexes | HIGH | Added: Full index definitions |
| 11 | Client-side price tamper | HIGH | Added: Server-side price calculation |
| 12 | No admin order mgmt | HIGH | Added: Full order dashboard |
| 13 | Guest tracking impossible | HIGH | Added: Reference-based lookup page |
| 14 | Missing ORDER fields | HIGH | Added: name, phone, email, notes, notification_status, reference |
| 15 | bcrypt unspecified | HIGH | Resolved: No passwords = no bcrypt |
| 16 | No states defined | MEDIUM | Added: Loading/error/empty states per component |
| 17 | Glassmorphism perf | MEDIUM | Added: Progressive enhancement with @supports |
| 18 | No SEO | MEDIUM | Added: schema.org, Metadata API, sitemap |
| 19 | Cart not persisted | MEDIUM | Added: Zustand persist middleware |
| 20 | NGN formatting | MEDIUM | Added: Custom formatter with ₦ character |
| 21 | No privacy/terms | MEDIUM | Added: /privacy and /terms pages |
| 22 | Image upload undefined | MEDIUM | Added: Uploadthing, 2MB max, admin upload UI |
| 23 | Seed script useless | MEDIUM | Added: Admin setup wizard for first-time use |
| 24 | Double cold start | MEDIUM | Resolved: M0 free tier (always-on) + ISR |
| 25 | Incomplete env docs | MEDIUM | Added: Complete .env.example with comments |
| 26 | Cart merge logic | MEDIUM | Added: Explicit merge key specification |
| 27 | No contact page | MEDIUM | Added: Contact footer on all pages |
| 28 | Session strategy | MEDIUM | Added: JWT, 7-day maxAge |
| 29 | No analytics | LOW | Added: PostHog (1M events/month free) |
| 30 | No PWA manifest | LOW | Added: manifest.ts + icons |
| 31 | Dark theme outdoor | LOW | Accepted risk: WCAG AA contrast minimum enforced |
| 32 | Opera Mini compat | LOW | Accepted risk: Opera Mini Extreme not supported |
| 33 | Catering checkbox vague | LOW | Added: Prominent label in email, admin visibility |
| 34 | No custom 404 | LOW | Added: not-found.tsx + error.tsx |
| 35 | Hard-delete breaks history | LOW | Added: Soft-delete with is_active flag |
| 36 | No error monitoring | LOW | Added: Sentry free tier |

---

## Appendix B: Second-Pass Review Fixes (Spec Reviewer)

| # | Finding | Severity | Disposition |
|---|---------|----------|------------|
| 1 | Vercel Hobby prohibits commercial use | CRITICAL | Switched to Railway |
| 2 | Resend 100/day hard cap not mentioned | CRITICAL | Added daily limit to spec + risk register |
| 3 | Next.js 14+ outdated (16 is current) | CRITICAL | Updated to Next.js 16 |
| 4 | Tailwind 3.x outdated (4.x is current) | CRITICAL | Updated to Tailwind 4.x (CSS-first config) |
| 5 | Framer Motion rebranded to Motion | CRITICAL | Updated package reference to `motion/react` |
| 6 | NextAuth v4 patterns (v5/Auth.js is current) | IMPORTANT | Updated to Auth.js v5 pattern, `AUTH_` env prefix |
| 7 | Upstash limits wrong (500K/month not 10K/day) | IMPORTANT | Fixed |
| 8 | MongoDB M0 is 500 connections not 100 | IMPORTANT | Fixed |
| 9 | HP-XXXX collision risk (10K values) | IMPORTANT | Changed to HP-XXXXX (100K values) |
| 10 | Missing RESEND_FROM_EMAIL env var | IMPORTANT | Added |
| 11 | Cart store methods should be selectors | IMPORTANT | Changed to selector pattern |
| 12 | Missing search param on admin orders API | IMPORTANT | Added `search` query param |
| 13 | Missing resend notification endpoint | IMPORTANT | Added `POST /api/admin/orders/[id]/resend` |
| 14 | CSRF Origin check edge cases | IMPORTANT | Added `ALLOWED_ORIGINS` env var for multi-domain |
| 15 | font-display: swap causes CLS | SUGGESTION | Changed to `font-display: optional` |
| 16 | No MongoDB driver specified | SUGGESTION | Specified: native `mongodb` driver with Zod (no Mongoose) |
| 17 | ISR revalidation not explicit in API | SUGGESTION | Added `revalidatePath('/menu')` to mutation endpoints |
| 18 | No rate limit on upload endpoint | SUGGESTION | Added 20/hr rate limit |
| 19 | Guest lookup enumerable | SUGGESTION | Added phone as second factor + rate limiting |
| 20 | No error response format | SUGGESTION | Standardized: `{ error: string, code: string, details?: object }` |
