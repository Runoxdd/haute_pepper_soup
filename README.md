# Haute Pepper Soup

A premium Nigerian pepper soup delivery website. Customers browse a curated menu, add items to a cart, and place orders in seconds — no account required. The business owner receives instant notifications via email and WhatsApp, then contacts the customer to arrange payment and delivery. Built for Nigerian smartphone users, optimised for low-bandwidth mobile connections, and designed to hand off cleanly to a non-technical business owner.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4.x |
| Animation | Motion (Framer Motion successor) |
| Auth | Auth.js v5 (Google, Facebook, Apple OAuth) |
| Database | MongoDB Atlas (M0 free tier) |
| Email | Resend |
| Image storage | Uploadthing |
| Rate limiting | Upstash Redis |
| Deployment | Vercel |

---

## Features

- Dark luxury design with progressive glassmorphism (graceful fallback on budget Android devices)
- Mobile-first — optimised for Nigerian mobile traffic (~80% of users)
- Guest-first ordering — no account required to place an order
- Admin panel for menu management (add/edit/remove dishes, upload images, manage sides) and order tracking
- Instant email notifications to the business owner on every order via Resend
- WhatsApp deep-link button so customers can follow up on their order with a pre-filled message
- Server-side price validation — totals are always calculated on the server, never trusted from the client
- Rate limiting via Upstash Redis to prevent order spam and inbox flooding
- CSRF protection via the `ALLOWED_ORIGINS` environment variable

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Local Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd haute-pepper-soup

# 2. Install dependencies
pnpm install

# 3. Copy the environment variables template
cp .env.example .env.local
# Open .env.local and fill in all required values (see Environment Variables below)

# 4. Start the development server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Seed the Database

To populate the database with placeholder menu items for development:

```bash
npx tsx scripts/seed.ts
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values before running locally. In production, add these in the Vercel project Settings > Environment Variables.

| Group | Variables | Description |
|---|---|---|
| Auth | `AUTH_SECRET`, `AUTH_URL` | Session signing secret and canonical app URL |
| Google OAuth | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google Cloud Console credentials (required) |
| Facebook OAuth | `AUTH_FACEBOOK_ID`, `AUTH_FACEBOOK_SECRET` | Facebook Developer App credentials (optional) |
| Apple OAuth | `APPLE_SERVICES_ID`, `APPLE_PRIVATE_KEY` | Apple Developer credentials (optional, requires $99/year developer account) |
| Database | `MONGODB_URI` | MongoDB Atlas connection string |
| Admin access | `ADMIN_EMAILS` | Comma-separated list of admin email addresses |
| Email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Resend API key and sender address |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp number in international format without `+` (e.g. `2348012345678`) |
| Image storage | `UPLOADTHING_TOKEN` | Uploadthing app token |
| Rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST credentials |
| Security | `ALLOWED_ORIGINS` | Comma-separated list of allowed origins for CSRF protection |
| Monitoring | `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking (optional) |
| Analytics | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | PostHog project credentials (optional) |

See `.env.example` for the full list with inline comments and instructions for obtaining each value.

---

## Deployment

This project deploys to [Vercel](https://vercel.com) — the platform built by the creators of Next.js. The free Hobby tier works for development and early launch. Upgrade to Pro ($20/month) when the business scales.

For a full step-by-step walkthrough — including setting environment variables, configuring a custom domain, and enabling automatic deployments on push — see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

**Deployment in brief:**
1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com), import the GitHub repo.
3. Add all environment variables in the Vercel project Settings > Environment Variables.
4. Vercel auto-detects Next.js and deploys automatically on every push to `main`.

---

## Admin Panel

The admin panel is available at `/admin`.

Access is granted to any signed-in user whose email address appears in the `ADMIN_EMAILS` environment variable. Multiple addresses are separated by commas:

```
ADMIN_EMAILS=owner@example.com,manager@example.com
```

The admin panel provides:

- A dashboard showing today's orders, total revenue, and pending contact count
- Full menu management: add, edit, and soft-delete dishes; upload dish images; configure available sides per dish
- A paginated order list with status filters; mark orders as contacted or completed

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/superpowers/specs/2026-03-17-haute-pepper-soup-design.md`](docs/superpowers/specs/2026-03-17-haute-pepper-soup-design.md) | Full design specification: data model, API routes, component structure, and UI decisions |
| [`docs/superpowers/specs/2026-03-17-haute-pepper-soup-services-guide.md`](docs/superpowers/specs/2026-03-17-haute-pepper-soup-services-guide.md) | Services setup guide: step-by-step signup instructions for every external service and a full cost breakdown |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Step-by-step Vercel deployment guide |

An owner guide written for the non-technical business owner — covering how to manage the menu, view orders, and handle common tasks — will be added to `docs/` before handover.

---

## License

MIT
