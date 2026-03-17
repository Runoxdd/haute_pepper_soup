# Haute Pepper Soup — Services Setup Guide & Cost Analysis

**Companion to**: `2026-03-17-haute-pepper-soup-design.md`
**Purpose**: Step-by-step signup instructions for every external service, and a cost breakdown so you can decide what to include.

---

## Cost Summary Table

| Service | Free Tier | Limits | Paid Tier | When You'd Upgrade | Required? |
|---------|-----------|--------|-----------|---------------------|-----------|
| **Railway** (hosting) | Trial: $5 credit | ~500 hrs runtime/month | Hobby $5/month | Always-on production (trial runs out ~day 21) | Yes |
| **MongoDB Atlas** (database) | M0 Free | 512MB storage, 500 connections, always-on | M2 $9/month | >512MB data or need dedicated cluster | Yes |
| **Resend** (email) | Free | 3,000/month, **100/day hard cap**, 1 domain | $20/month for 50K emails | >100 orders/day OR >3,000/month | Yes |
| **Upstash Redis** (rate limiting) | Free | 500K commands/month, 256MB | $10/month for 10M commands | >500K rate limit checks/month | Yes (security) |
| **Uploadthing** (image storage) | Free | 2GB storage, 2GB bandwidth/month | $10/month for 100GB | >2GB of dish images (unlikely) | Yes |
| **Google OAuth** | Free | Unlimited | N/A | Never | Yes |
| **Apple Sign In** | Free | Requires Apple Developer account ($99/year) | $99/year | Required upfront | Optional |
| **Facebook Login** | Free | Unlimited | N/A | Never | Optional |
| **Sentry** (error monitoring) | Free | 5K errors/month, 1 user | $26/month | >5K errors or team access | Optional |
| **PostHog** (analytics) | Free | 1M events/month | $0.00031/event after | >1M events/month (very unlikely) | Optional |
| **Google Maps Places API** | $200 free credit/month | ~10,000 autocomplete requests | Pay-as-you-go after credit | If you add address autocomplete later | Not now |

### Monthly Cost Scenarios

| Scenario | Monthly Cost |
|----------|-------------|
| **Launch (trial)** | **$0/month** for ~21 days, then **$5/month** Railway Hobby (+ $99/year if Apple Sign In) |
| **Growing (100 orders/day)** | **$5/month** (Railway Hobby only, all else within free tiers) |
| **Busy (500 orders/day)** | ~**$25/month** (Railway $5 + Resend $20) |
| **High traffic (1000+ orders/day)** | ~**$45/month** (Railway $5 + Resend $20 + Upstash $10 + Uploadthing $10) |

---

## Service-by-Service Setup

### 1. Railway (Hosting & Deployment)

**Env vars**: None directly (Railway hosts the app)
**Cost**: Trial: $5 credit free, then Hobby $5/month
**Required**: Yes

#### Why Railway Instead of Vercel?
Vercel's Hobby (free) plan **prohibits commercial use**. Since Haute Pepper Soup is a business taking food orders, Vercel would require their Pro plan ($20/month). Railway allows commercial use and costs only $5/month.

#### Signup Steps
1. Go to [railway.app](https://railway.app)
2. Click "Login" → Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select the `haute-pepper-soup` repository
5. Railway auto-detects Next.js and configures the build
6. Go to your service → "Variables" tab → Add all environment variables from `.env.example`
7. Railway deploys automatically

#### What You Get
- Automatic deployments on every git push
- Preview deployments for PRs
- Free SSL certificate
- Custom domain support (free)
- Always-on server (no cold starts like serverless)

#### Notes
- The trial gives $5 credit (~500 hours). For always-on production, upgrade to Hobby ($5/month).
- Custom domain: Add in Railway dashboard → Service → Settings → Domains.
- Railway assigns a URL like `haute-pepper-soup.up.railway.app` by default.

---

### 2. MongoDB Atlas (Database)

**Env var**: `MONGODB_URI`
**Cost**: Free (M0)
**Required**: Yes

#### Signup Steps
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" → Create account (or sign in with Google)
3. Create a new project: "haute-pepper-soup"
4. Click "Build a Database"
5. Select **M0 Free** tier
6. Provider: AWS. Region: Choose closest to Nigeria (e.g., `eu-west-1` Ireland, or `af-south-1` Cape Town if available)
7. Cluster name: `haute-pepper-soup`
8. Click "Create Cluster"

#### Database User Setup
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication: Password
4. Username: `haute-app` (or any name)
5. Password: Click "Autogenerate Secure Password" — **copy this password**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

#### Network Access (CRITICAL for Vercel)
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" → This sets `0.0.0.0/0`
4. **Why**: Vercel serverless functions use dynamic IPs. Without this, your app cannot connect to MongoDB.
5. Click "Confirm"

#### Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Select "Drivers"
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://haute-app:<password>@haute-pepper-soup.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you copied earlier
6. Add database name: append `/hautepeppersoup` before the `?`:
   ```
   mongodb+srv://haute-app:YOUR_PASSWORD@haute-pepper-soup.xxxxx.mongodb.net/hautepeppersoup?retryWrites=true&w=majority
   ```

**Set in Railway**: `MONGODB_URI` = the full connection string above

#### Free Tier Limits
- 512MB storage (plenty — text-only orders are tiny, images stored in Vercel Blob)
- Shared cluster (adequate for this traffic level)
- Always-on (no cold starts, unlike Serverless tier)
- 100 connections max

---

### 3. Resend (Email Notifications)

**Env var**: `RESEND_API_KEY`
**Cost**: Free (3,000 emails/month)
**Required**: Yes

#### Signup Steps
1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" → Create account
3. You're in the dashboard

#### Get API Key
1. Go to "API Keys" in left sidebar
2. Click "Create API Key"
3. Name: `haute-pepper-soup`
4. Permission: "Sending access"
5. Domain: "All domains" (for now)
6. Click "Add" → **Copy the API key immediately** (shown only once)

**Set in Railway**: `RESEND_API_KEY` = the key you just copied

#### Domain Verification (Optional but Recommended)
By default, Resend sends from `onboarding@resend.dev`. To send from your own domain (e.g., `orders@hautepeppersoup.com`):

1. Go to "Domains" in left sidebar
2. Click "Add Domain"
3. Enter your domain (e.g., `hautepeppersoup.com`)
4. Add the DNS records Resend provides to your domain registrar
5. Wait for verification (usually 5-30 minutes)

#### Free Tier Limits
- 3,000 emails/month (~100/day)
- 1 custom sending domain
- Email delivery tracking

---

### 4. Upstash Redis (Rate Limiting)

**Env vars**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
**Cost**: Free (10,000 commands/day)
**Required**: Yes (prevents order spam and abuse)

#### Signup Steps
1. Go to [upstash.com](https://upstash.com)
2. Click "Sign Up" → Create account (or sign in with Google/GitHub)
3. You're in the console

#### Create Redis Database
1. Click "Create Database"
2. Name: `haute-pepper-soup`
3. Type: Regional
4. Region: Choose closest to your Vercel deployment (e.g., `eu-west-1` Ireland)
5. Click "Create"

#### Get Credentials
1. Click on your new database
2. Scroll to "REST API" section
3. Copy `UPSTASH_REDIS_REST_URL` — looks like `https://xxxx.upstash.io`
4. Copy `UPSTASH_REDIS_REST_TOKEN` — a long string

**Set in Railway**:
- `UPSTASH_REDIS_REST_URL` = the URL
- `UPSTASH_REDIS_REST_TOKEN` = the token

#### Free Tier Limits
- 10,000 commands/day (each rate limit check = 1 command)
- 256MB storage
- 1 database

#### Can You Skip This?
Without rate limiting, anyone can spam the order endpoint and flood the owner's inbox. **Strongly recommended** for security. If you absolutely must skip it, remove the rate limiting middleware — but understand the risk.

---

### 5. Uploadthing (Image Storage)

**Env var**: `UPLOADTHING_TOKEN`
**Cost**: Free (2GB storage)
**Required**: Yes (for admin image uploads)

#### Why Uploadthing Instead of Vercel Blob?
Since we're using Railway (not Vercel), Vercel Blob isn't available. Uploadthing is designed for Next.js, has a generous free tier, and works on any hosting platform.

#### Signup Steps
1. Go to [uploadthing.com](https://uploadthing.com)
2. Click "Sign Up" → Sign in with GitHub
3. Create a new app: "haute-pepper-soup"

#### Get Token
1. Go to your app dashboard
2. Click "API Keys" in the sidebar
3. Copy the `UPLOADTHING_TOKEN`

**Set in Railway**: `UPLOADTHING_TOKEN` = the token

#### Free Tier Limits
- 2GB storage (plenty for dish photos)
- 2GB bandwidth/month

---

### 6. Google OAuth (Sign in with Google)

**Env vars**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
**Cost**: Free
**Required**: Yes (primary login method)

#### Setup Steps
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project: "Haute Pepper Soup"
3. In the left sidebar, go to "APIs & Services" → "OAuth consent screen"

#### Configure Consent Screen
1. User Type: **External**
2. App name: "Haute Pepper Soup"
3. User support email: your email
4. App logo: optional (can add later)
5. App domain: your Vercel domain (e.g., `https://hautepeppersoup.vercel.app`)
6. **Authorized domains**: Add your domain (e.g., `hautepeppersoup.vercel.app`)
7. Developer contact email: your email
8. Click "Save and Continue"
9. Scopes: Add `email` and `profile` → Save and Continue
10. Test users: Add your email for testing → Save and Continue
11. Click "Back to Dashboard"

#### Create OAuth Client
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: "Haute Pepper Soup Web"
5. Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://hautepeppersoup.vercel.app` (production)
   - `https://your-custom-domain.com` (if using custom domain)
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://hautepeppersoup.vercel.app/api/auth/callback/google`
   - `https://your-custom-domain.com/api/auth/callback/google`
7. Click "Create"
8. **Copy the Client ID and Client Secret**

**Set in Railway**:
- `GOOGLE_CLIENT_ID` = the Client ID
- `GOOGLE_CLIENT_SECRET` = the Client Secret

#### Publishing the App
- While in "Testing" mode, only test users can log in (max 100 users)
- To allow anyone to log in, you need to **publish** the app and go through Google's verification
- Verification requires: privacy policy URL, app homepage, explanation of data usage
- This can take 1-4 weeks for approval
- **Workaround**: Apps requesting only `email` and `profile` scopes often get approved quickly

#### IMPORTANT
- Google requires a privacy policy URL. This is why we have a `/privacy` page in the spec.
- Without it, the consent screen shows "This app hasn't been verified" warning.

---

### 7. Apple Sign In (Optional)

**Env vars**: `APPLE_ID`, `APPLE_SECRET`
**Cost**: $99/year (Apple Developer account)
**Required**: No (can defer to Phase 2 or skip entirely)

#### Why It's Optional
Apple Sign In requires an Apple Developer account ($99/year). For a small food delivery site, this cost may not be justified. Google + Facebook covers most Nigerian users.

#### Setup Steps (If Implementing)
1. Go to [developer.apple.com](https://developer.apple.com)
2. Enroll in the Apple Developer Program ($99/year)
3. Go to "Certificates, Identifiers & Profiles"
4. Register an App ID with "Sign in with Apple" capability
5. Create a Services ID for web authentication
6. Configure the domain and redirect URL
7. Create a key for the secret

This is the most complex OAuth setup. Apple's documentation is authoritative: [Sign in with Apple for web](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple)

#### Decision Point
**Recommendation**: Skip Apple Sign In for launch. Add it later if the owner's customers request it. Google + Facebook covers the vast majority of Nigerian smartphone users.

| Keep | Skip | Impact |
|------|------|--------|
| Covers iPhone users who prefer Apple | Saves $99/year | Low — iPhone users also have Google accounts |

---

### 8. Facebook Login (Optional)

**Env vars**: `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
**Cost**: Free
**Required**: No (Google alone covers most users, but Facebook is popular in Nigeria)

#### Setup Steps
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. App Type: "Consumer"
4. App Name: "Haute Pepper Soup"
5. Click "Create App"

#### Configure Facebook Login
1. In the app dashboard, find "Facebook Login" → Click "Set Up"
2. Select "Web"
3. Site URL: `https://hautepeppersoup.vercel.app`
4. Click "Save"
5. Go to "Facebook Login" → "Settings" in left sidebar
6. Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook`
   - `https://hautepeppersoup.vercel.app/api/auth/callback/facebook`
7. Click "Save Changes"

#### Get Credentials
1. Go to "Settings" → "Basic" in left sidebar
2. Copy **App ID** (this is the Client ID)
3. Copy **App Secret** (click "Show", enter password)

**Set in Railway**:
- `FACEBOOK_CLIENT_ID` = the App ID
- `FACEBOOK_CLIENT_SECRET` = the App Secret

#### App Review
- Facebook requires app review for public access
- For "Facebook Login" permission, the review is usually straightforward
- Submit for review: provide screenshots and description of how login is used
- Review takes 1-5 business days

#### Decision Point
**Recommendation**: Include Facebook Login. It's free, Facebook is widely used in Nigeria, and it provides a second login option if Google has issues.

---

### 9. Auth Secret

**Env var**: `AUTH_SECRET`
**Cost**: Free (you generate it)
**Required**: Yes

#### Generate
Run this command in your terminal:
```bash
openssl rand -base64 32
```
This outputs a random string like: `K7gNu9rLs2xPdE4mQw8yVhJf3tBaCiOz1nXk5eFpRo=`

**Set in Railway**: `AUTH_SECRET` = the generated string

#### IMPORTANT
- This MUST be kept secret. Never commit it to git.
- If compromised, generate a new one. All existing sessions will be invalidated.
- Auth.js v5 uses `AUTH_SECRET` (not the older `NEXTAUTH_SECRET`).

---

### 10. Auth URL

**Env var**: `AUTH_URL`
**Cost**: Free
**Required**: Yes

#### Values
- **Development**: `http://localhost:3000`
- **Production**: `https://haute-pepper-soup.up.railway.app` (or your custom domain)

**Set in Railway**: `AUTH_URL` = your production URL

#### Note
Auth.js v5 uses `AUTH_URL` instead of the older `NEXTAUTH_URL`. On Railway, you must set this explicitly as Railway does not have Vercel's auto-detection.

---

### 11. WhatsApp Number

**Env var**: `NEXT_PUBLIC_WHATSAPP_NUMBER`
**Cost**: Free
**Required**: Yes (for the WhatsApp contact button)

#### Setup
1. Get the business owner's WhatsApp phone number
2. Format it in international format WITHOUT the `+` sign
3. Example: Nigerian number `0801 234 5678` → `2348012345678`

**Set in Railway**: `NEXT_PUBLIC_WHATSAPP_NUMBER` = `2348012345678`

#### How It's Used
The WhatsApp button generates a link like:
```
https://wa.me/2348012345678?text=Hi%2C%20I%20placed%20order%20HP-7291%20on%20Haute%20Pepper%20Soup
```

This opens WhatsApp with a pre-filled message. No WhatsApp Business API needed — this uses the standard `wa.me` deep link.

#### Note
`NEXT_PUBLIC_` prefix means this value is exposed to the browser (it's in the WhatsApp button URL). This is fine — it's a public business phone number.

---

### 12. Sentry (Error Monitoring — Optional)

**Env var**: `NEXT_PUBLIC_SENTRY_DSN`
**Cost**: Free (5,000 errors/month)
**Required**: No, but strongly recommended

#### Signup Steps
1. Go to [sentry.io](https://sentry.io)
2. Click "Sign Up" → Create account
3. Create a new project
4. Platform: Next.js
5. Copy the DSN (Data Source Name) — looks like `https://xxxx@o12345.ingest.sentry.io/67890`

**Set in Railway**: `NEXT_PUBLIC_SENTRY_DSN` = the DSN

#### What You Get
- Automatic error capturing in production
- Email alerts when errors occur
- Stack traces with source maps
- Performance monitoring

#### Decision Point
**Recommendation**: Include it. Free, takes 10 minutes to set up, and you'll want to know when things break — especially after handover when you're no longer actively watching the site.

---

## Complete Cost Decision Matrix

Use this to decide what to include or skip:

| Service | Cost | Effort to Set Up | Value | Recommendation |
|---------|------|-------------------|-------|----------------|
| Railway | $5/month (trial: $5 free) | 5 min | Essential (commercial hosting) | **Must have** |
| MongoDB Atlas M0 | Free | 15 min | Essential | **Must have** |
| Google OAuth | Free | 30 min | Essential (primary login) | **Must have** |
| Resend | Free | 10 min | Essential (order notifications) | **Must have** |
| Upstash Redis | Free | 10 min | Security (rate limiting) | **Must have** |
| Uploadthing | Free | 5 min | Admin image uploads | **Must have** |
| Auth Secret | Free | 1 min | Security | **Must have** |
| Facebook Login | Free | 20 min | Popular in Nigeria | **Should have** |
| Sentry | Free | 10 min | Know when things break | **Should have** |
| PostHog | Free | 5 min | Traffic insights (1M events/month) | **Nice to have** |
| Apple Sign In | $99/year | 45 min | iPhone users | **Can skip** |
| Google Maps API | ~$0 (free credit) | 20 min | Address autocomplete | **Not now** (future) |

### Total Cost at Launch

| If you include... | Cost |
|---|---|
| Everything except Apple Sign In | **$5/month** (Railway Hobby) |
| Everything including Apple Sign In | **$5/month** + **$99/year** |
| During Railway trial period | **$0/month** for ~21 days |

---

## Quick Reference: All Env Vars

| Variable | Source | Public? | Required? |
|----------|--------|---------|-----------|
| `AUTH_URL` | You set it | No | Yes |
| `AUTH_SECRET` | You generate it | No | Yes |
| `AUTH_GOOGLE_ID` | Google Cloud Console | No | Yes |
| `AUTH_GOOGLE_SECRET` | Google Cloud Console | No | Yes |
| `APPLE_SERVICES_ID` | Apple Developer | No | No |
| `APPLE_PRIVATE_KEY` | Apple Developer | No | No |
| `AUTH_FACEBOOK_ID` | Facebook Developers | No | Optional |
| `AUTH_FACEBOOK_SECRET` | Facebook Developers | No | Optional |
| `MONGODB_URI` | MongoDB Atlas | No | Yes |
| `ADMIN_EMAILS` | You set it | No | Yes |
| `RESEND_API_KEY` | Resend dashboard | No | Yes |
| `RESEND_FROM_EMAIL` | You set it | No | Yes |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business owner | **Yes** | Yes |
| `UPLOADTHING_TOKEN` | Uploadthing dashboard | No | Yes |
| `UPSTASH_REDIS_REST_URL` | Upstash console | No | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash console | No | Yes |
| `ALLOWED_ORIGINS` | You set it | No | Yes |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry dashboard | **Yes** | No |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog dashboard | **Yes** | No |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog dashboard | **Yes** | No |
