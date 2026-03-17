# Deployment Guide

This guide walks you through deploying Haute Pepper Soup to Vercel and setting up all the required services. Follow the steps in order.

## Quick Start (Preview Only)

If you just want to see the site running without any backend services:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project" and import the `haute-pepper-soup` repo
3. Click "Deploy" — no environment variables needed
4. The site will deploy with mock data (3 sample dishes, 4 sample orders)

That's it for a preview. For a production deployment with real data, follow the steps below.

---

## Full Production Setup

### Step 1: Create a MongoDB Database (Free)

This stores your menu items, orders, and user accounts.

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a cluster:
   - Click "Build a Database"
   - Choose **M0 Free** tier
   - Region: choose the closest to Nigeria (e.g., Europe West or Africa South)
   - Click "Create Cluster"
3. Create a database user:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Set a username (e.g., `haute-app`) and click "Autogenerate Secure Password"
   - **Copy the password** — you'll need it
   - Click "Add User"
4. Allow network access:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click **"Allow Access from Anywhere"** (sets `0.0.0.0/0`)
   - This is required because Vercel uses dynamic IPs
5. Get the connection string:
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy the connection string — it looks like:
     ```
     mongodb+srv://haute-app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with the password you copied in step 3
   - Add the database name before the `?`:
     ```
     mongodb+srv://haute-app:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hautepeppersoup?retryWrites=true&w=majority
     ```

**Env var to set:** `MONGODB_URI` = your full connection string

---

### Step 2: Set Up Google Sign-In (Free)

This lets customers sign in with their Google account.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project called "Haute Pepper Soup"
3. Go to "APIs & Services" > "OAuth consent screen":
   - User Type: External
   - App name: "Haute Pepper Soup"
   - Add your email as support email and developer contact
   - Scopes: add `email` and `profile`
   - Save
4. Go to "APIs & Services" > "Credentials":
   - Click "Create Credentials" > "OAuth client ID"
   - Type: Web application
   - Name: "Haute Pepper Soup Web"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local dev)
     - `https://your-project.vercel.app` (your Vercel URL)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-project.vercel.app/api/auth/callback/google`
   - Click "Create"
   - **Copy the Client ID and Client Secret**

**Env vars to set:**
- `AUTH_GOOGLE_ID` = the Client ID
- `AUTH_GOOGLE_SECRET` = the Client Secret

---

### Step 3: Generate Auth Secret (Free)

This signs your session cookies. Run this in any terminal:

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

**Env var to set:** `AUTH_SECRET` = the random string you generated

---

### Step 4: Set Up Email Notifications (Free)

This sends you an email every time a customer places an order.

1. Go to [resend.com](https://resend.com) and create a free account
2. Go to "API Keys" in the sidebar
3. Click "Create API Key", name it "haute-pepper-soup", permission "Sending access"
4. **Copy the API key** (shown only once)

**Env vars to set:**
- `RESEND_API_KEY` = the API key
- `RESEND_FROM_EMAIL` = `onboarding@resend.dev` (works immediately, or set up your own domain later)

---

### Step 5: Set Your Admin Email

This controls who can access the admin panel at `/admin`.

**Env var to set:** `ADMIN_EMAILS` = your email address (the same one you use for Google sign-in)

Multiple admins: `ADMIN_EMAILS=you@gmail.com,partner@gmail.com`

---

### Step 6: Set Your WhatsApp Number

This appears on the floating WhatsApp button so customers can contact you.

Format: Nigerian number without the `+` sign. Example: `0801 234 5678` becomes `2348012345678`

**Env var to set:** `NEXT_PUBLIC_WHATSAPP_NUMBER` = `2348012345678`

---

### Step 7: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import the `haute-pepper-soup` repository
4. Before clicking Deploy, add these environment variables:

| Variable | Value | Required? |
|----------|-------|-----------|
| `MONGODB_URI` | Your MongoDB connection string from Step 1 | Yes |
| `AUTH_SECRET` | Your generated secret from Step 3 | Yes |
| `AUTH_GOOGLE_ID` | Google Client ID from Step 2 | Yes |
| `AUTH_GOOGLE_SECRET` | Google Client Secret from Step 2 | Yes |
| `RESEND_API_KEY` | Resend API key from Step 4 | Yes |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` | Yes |
| `ADMIN_EMAILS` | Your Google email | Yes |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp number (e.g., `2348012345678`) | Yes |
| `AUTH_URL` | `https://your-project.vercel.app` | Yes |
| `ALLOWED_ORIGINS` | `https://your-project.vercel.app` | Yes |

5. Click **Deploy**
6. Once deployed, copy your Vercel URL (e.g., `https://haute-pepper-soup.vercel.app`)
7. Go back to Vercel project Settings > Environment Variables and update:
   - `AUTH_URL` = your actual Vercel URL
   - `ALLOWED_ORIGINS` = your actual Vercel URL
8. Go back to Google Cloud Console and add your Vercel URL to the OAuth redirect URIs

---

### Step 8: Seed Your Menu (First Time Only)

After deploying, go to `https://your-site.vercel.app/admin`. Sign in with the Google account matching your `ADMIN_EMAILS`. The admin panel will show a setup wizard to add your first dish.

Alternatively, run the seed script locally:
```bash
npx tsx scripts/seed.ts
```

---

## Optional Services

These aren't required but improve the experience:

### Facebook Login
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create an app, set up Facebook Login
3. Add your Vercel URL as a valid OAuth redirect URI
4. Set `AUTH_FACEBOOK_ID` and `AUTH_FACEBOOK_SECRET` in Vercel

### Rate Limiting (Recommended)
Prevents spam orders from flooding your inbox.
1. Go to [upstash.com](https://upstash.com) and create a free Redis database
2. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel

### Image Uploads
For uploading dish photos from the admin panel.
1. Go to [uploadthing.com](https://uploadthing.com) and create a free account
2. Set `UPLOADTHING_TOKEN` in Vercel

### Error Monitoring
Get email alerts when something breaks.
1. Go to [sentry.io](https://sentry.io) and create a free Next.js project
2. Set `NEXT_PUBLIC_SENTRY_DSN` in Vercel

---

## Custom Domain

1. In Vercel, go to your project > Settings > Domains
2. Add your domain (e.g., `hautepeppersoup.com`)
3. Follow Vercel's instructions to update your DNS records
4. After the domain is active, update these env vars:
   - `AUTH_URL` = `https://hautepeppersoup.com`
   - `ALLOWED_ORIGINS` = `https://hautepeppersoup.com`
5. Update Google OAuth redirect URIs to include your custom domain

---

## Troubleshooting

**"MONGODB_URI environment variable is not set"**
The app needs MongoDB to store data. Without it, it runs in mock mode with sample data. Set the `MONGODB_URI` env var to connect to a real database.

**Google sign-in shows "This app hasn't been verified"**
This is normal during development. Click "Continue" to proceed. To remove this warning, submit your app for Google verification (requires a privacy policy page — the site already has one at `/privacy`).

**Orders aren't sending emails**
Check that `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set correctly. Check the admin panel — if an order shows "Notification Failed", click "Resend Notification".

**Can't access /admin**
Make sure you're signed in with an email that matches `ADMIN_EMAILS` (case-insensitive). Check for typos or extra spaces.
