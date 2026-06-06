# EverestBazar — Project Specification for Claude Code

## What This Is

EverestBazar (everestbazar.com) is Nepal's first verified recommerce
marketplace. It is a full web application — not a marketing site.
The website IS the product.

**The problem it solves:**
Buying and selling secondhand goods in Nepal is dangerous. People
send money to strangers on Facebook groups and never receive items.
Hamrobazar (Nepal's main classifieds site, founded 2005) has zero
trust infrastructure — no verified sellers, no payment protection,
no dispute resolution. Nepal's cybercrime complaints grew 6× in
5 years. Most victims lose money with no legal recourse.

**How EverestBazar fixes it:**
1. Every seller verified against Nepal National ID before listing
2. Every payment held in escrow until buyer confirms delivery
3. Real dispute resolution with admin arbitration
4. Structured condition grading enforced by photo requirements

**Build order:**
Phase 1 → Full Next.js web app (this project)
Phase 2 → React Native mobile app (after first revenue)

Domain: everestbazar.com
Tagline: "Nepal's verified marketplace"

---

## Tech Stack — Non-Negotiable

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack — SSR + API routes |
| Language | TypeScript (strict) | Everywhere, no exceptions |
| Styling | Tailwind CSS + custom design tokens | Mobile-first |
| State (client) | Zustand | Auth, cart, chat state |
| State (server) | TanStack Query (React Query) | All API calls |
| Auth | Custom JWT + httpOnly cookies + AWS Cognito | Phone OTP flow |
| Database | AWS DynamoDB (single-table) | Via Lambda |
| Backend | AWS Lambda + Node.js 20 (TypeScript) | Called from Next.js API routes |
| File uploads | AWS S3 presigned URLs (direct browser → S3) | For listing photos + KYC docs |
| CDN | AWS CloudFront | Serves S3 media |
| Real-time chat | AWS API Gateway WebSocket | Lambda-backed |
| Payments | eSewa (form POST redirect) + Khalti (JS SDK) | Nepal digital wallets |
| Notifications | WhatsApp Business Cloud API | Booking + escrow alerts |
| Email | AWS SES | Transactional only |
| Deployment | Vercel (web app) + AWS SAM (backend) | |
| PWA | next-pwa | "Add to homescreen" on mobile |

---

## Architecture Overview

```
Browser (Nepal user, mostly mobile)
    │
    ▼
Next.js App (Vercel)
    ├── Server Components — data fetching, SEO, public pages
    ├── Client Components — forms, chat, camera, payments
    ├── /app/api/          — thin API route layer (proxies to Lambda)
    └── /public/           — static assets, PWA manifest
         │
         │ HTTPS (API calls)
         ▼
    API Gateway (AWS)
         │
         ├── REST API → Lambda functions
         └── WebSocket API → Chat Lambda
              │
              ├── DynamoDB (data)
              ├── S3 (photos, KYC docs)
              ├── Cognito (auth)
              └── SES / WhatsApp (notifications)
```

---

## Repository Structure

```
everestbazar/
├── CLAUDE.md                          # This file — Claude Code reads this first
├── package.json                       # Root (single app, no monorepo needed)
├── next.config.ts                     # Next.js + PWA config
├── tailwind.config.ts                 # Design system tokens
├── tsconfig.json                      # Strict TypeScript
├── .env.local.example                 # All env vars documented
│
├── app/                               # Next.js App Router
│   │
│   ├── layout.tsx                     # Root layout (fonts, providers, PWA meta)
│   ├── globals.css                    # Tailwind + CSS variables
│   ├── not-found.tsx                  # 404 page
│   │
│   ├── (public)/                      # Public routes — no auth required
│   │   ├── layout.tsx                 # Public layout (header + footer)
│   │   ├── page.tsx                   # Landing page (/)
│   │   ├── how-it-works/page.tsx      # /how-it-works
│   │   ├── sell/page.tsx              # /sell
│   │   └── protection/page.tsx        # /protection
│   │
│   ├── (auth)/                        # Auth routes — redirect if logged in
│   │   ├── layout.tsx
│   │   ├── login/page.tsx             # Phone number entry
│   │   ├── verify/page.tsx            # OTP verification
│   │   └── kyc/
│   │       ├── upload/page.tsx        # NID front + back upload
│   │       ├── selfie/page.tsx        # Selfie capture (browser camera)
│   │       └── pending/page.tsx       # Verification in progress
│   │
│   └── (app)/                         # Protected app routes — requires auth + KYC
│       ├── layout.tsx                  # App shell (top nav + bottom mobile nav)
│       │
│       ├── browse/
│       │   └── page.tsx               # /browse — listings grid + filters
│       │
│       ├── listing/
│       │   ├── [id]/page.tsx          # /listing/[id] — listing detail
│       │   └── new/page.tsx           # /listing/new — create listing (multi-step)
│       │
│       ├── checkout/
│       │   └── [id]/page.tsx          # /checkout/[id] — escrow payment flow
│       │
│       ├── chat/
│       │   ├── page.tsx               # /chat — all conversations list
│       │   └── [chatId]/page.tsx      # /chat/[chatId] — chat thread
│       │
│       ├── profile/
│       │   ├── page.tsx               # /profile — own profile + listings
│       │   └── [userId]/page.tsx      # /profile/[userId] — public profile
│       │
│       ├── purchases/page.tsx         # /purchases — my escrow transactions
│       ├── sales/page.tsx             # /sales — my sold listings
│       └── dispute/[txnId]/page.tsx   # /dispute/[txnId] — dispute flow
│
├── app/api/                           # Next.js API routes (proxy to Lambda)
│   ├── auth/
│   │   ├── send-otp/route.ts
│   │   ├── verify-otp/route.ts
│   │   └── logout/route.ts
│   ├── listings/
│   │   └── [...slug]/route.ts         # Catch-all proxy to Lambda
│   ├── users/
│   │   └── [...slug]/route.ts
│   ├── transactions/
│   │   └── [...slug]/route.ts
│   ├── kyc/
│   │   └── [...slug]/route.ts
│   └── webhooks/
│       ├── esewa/route.ts             # eSewa payment callback
│       └── khalti/route.ts            # Khalti payment callback
│
├── components/
│   ├── ui/                            # Base design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Sheet.tsx                  # Bottom sheet (mobile)
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   │
│   ├── layout/
│   │   ├── Header.tsx                 # Top navigation
│   │   ├── MobileNav.tsx              # Bottom tab bar (mobile)
│   │   ├── Footer.tsx
│   │   └── AppShell.tsx
│   │
│   ├── listing/
│   │   ├── ListingCard.tsx            # Card in grid
│   │   ├── ListingGrid.tsx            # Responsive grid with loading states
│   │   ├── ListingFilters.tsx         # Filter bar + sheet
│   │   ├── ListingPhotos.tsx          # Photo carousel/gallery
│   │   ├── ConditionBadge.tsx
│   │   ├── ConditionGuide.tsx         # Modal explaining condition grades
│   │   └── CreateListingForm.tsx      # Multi-step create flow
│   │
│   ├── user/
│   │   ├── TrustScore.tsx
│   │   ├── VerifiedBadge.tsx
│   │   ├── UserCard.tsx
│   │   └── EscrowBadge.tsx
│   │
│   ├── chat/
│   │   ├── ChatList.tsx
│   │   ├── ChatThread.tsx
│   │   ├── MessageBubble.tsx
│   │   └── OfferMessage.tsx
│   │
│   ├── checkout/
│   │   ├── EscrowSummary.tsx
│   │   ├── PaymentSelector.tsx
│   │   ├── EsewaButton.tsx
│   │   └── KhaltiButton.tsx
│   │
│   └── kyc/
│       ├── NidUpload.tsx
│       ├── SelfieCapture.tsx          # Uses browser MediaDevices API
│       └── KycStatusBanner.tsx
│
├── lib/
│   ├── api.ts                         # Typed fetch wrapper with auth headers
│   ├── auth.ts                        # Cookie-based JWT helpers
│   ├── format.ts                      # formatNPR, formatDate, formatPhone
│   ├── validate.ts                    # Nepal phone, NID validators
│   ├── upload.ts                      # S3 presigned URL upload helper
│   └── types.ts                       # All shared TypeScript types
│
├── hooks/
│   ├── useAuth.ts                     # Current user + KYC status
│   ├── useListings.ts                 # Listings with TanStack Query
│   ├── useChat.ts                     # WebSocket chat connection
│   └── useUpload.ts                   # File upload to S3
│
├── store/
│   ├── authStore.ts                   # Zustand — user, tokens, KYC status
│   └── chatStore.ts                   # Zustand — messages, connections
│
└── infra/                             # AWS backend (deploy separately)
    ├── template.yaml                  # SAM template
    ├── lambdas/
    │   ├── auth/handler.ts
    │   ├── kyc/handler.ts
    │   ├── listings/handler.ts
    │   ├── users/handler.ts
    │   ├── transactions/handler.ts
    │   ├── payments/handler.ts
    │   ├── chat/handler.ts
    │   └── admin/handler.ts
    └── shared/
        ├── db.ts
        ├── auth.ts
        └── middleware.ts
```

---

## Design System — "Summit", crimson on cream

> Source of truth is the Claude Design handoff (Summit logo). The tokens below
> supersede the earlier teal/Inter draft. They are implemented as CSS variables
> in `app/globals.css` and mapped into Tailwind v4 via `@theme inline` (no
> `tailwind.config.ts` — Tailwind v4 is CSS-first). Use the variables / Tailwind
> tokens; never hardcode hex.

### Brand Colors (CSS variables → Tailwind tokens)

```css
/* app/globals.css :root */
--paper:   #F6F0E6;   /* primary background (cream)            → bg-paper   */
--paper-2: #EFE7D6;   /* raised surface / alt section          → bg-paper-2 */
--paper-3: #E7DCC6;   /* sunken / track fill                   → bg-paper-3 */
--ink:     #211B16;   /* primary text + dark sections          → text-ink   */
--ink-2:   #3A312A;   /* secondary text                                     */
--ink-soft:#6A5E52;   /* muted text / labels                                */

--crimson:     #BE3A2B;  /* PRIMARY brand — CTAs, links, prices → text/bg-crimson */
--crimson-d:   #9F2C20;  /* primary hover                                    */
--terracotta:  #C0692E;  /* accent (dispute / disputes step)                 */
--steel:       #3E6E86;  /* accent (escrow / locked states)                  */
--gold:        #C9962F;  /* accent (money in motion, ratings, on-dark eyebrow)*/
--green:       #3F7D52;  /* success / verified                               */

/* prayer-flag five — used only as the 3px hairline motif */
--pf-blue:#2C6FB3; --pf-white:#FBF7EE; --pf-red:#C0392B; --pf-green:#2E7D52; --pf-yellow:#E3A92B;
```

### Typography

- **Display (headings):** Bricolage Grotesque, weight 800, `letter-spacing:-0.02em` → `font-display`
- **Body:** Hanken Grotesk, 17px, line-height 1.55 → `font-body`
- **Labels / eyebrows / numbers:** IBM Plex Mono, uppercase, tracked → `font-mono`
- **Nepali:** Noto Sans Devanagari (loaded alongside; `:lang(ne)` bumps line-height)
- Loaded via `next/font` as the CSS vars `--font-bricolage / --font-hanken / --font-plex-mono / --font-noto-devanagari`.
- Inter is NOT used.

### Key UI Decisions

- **Mobile-first** — design for 375px screen, scale up
- **Bilingual** — every string has EN + नेपाली; toggle in the header (LanguageProvider)
- **Bottom tab nav on mobile** — Home, Browse, Sell, Chat, Profile
- **Top nav on desktop** — logo left, nav links centre, auth right
- **Listing grid** — 2 columns mobile, 3 tablet, 4 desktop
- **No stock photos** — listings use deterministic geometric `GeoThumb` art (peak/sun, hue-tinted)
- **Crimson for primary actions + prices; green for verified; steel for escrow; gold for money-in-motion**
- **Prayer-flag hairline** (3px five-colour band) tops the header and the footer credit
- **No modals on mobile** — use bottom sheets (slide up) instead
- **Cards have subtle shadow** — `var(--shadow)`, not border, for depth

---

## Database Schema (DynamoDB Single-Table)

Table name: `EverestBazar-{stage}`

### Key Access Patterns

```
PK                     SK                       What
USER#{userId}          PROFILE                  User profile
LISTING#{listingId}    DETAILS                  Listing
TXN#{txnId}           DETAILS                  Escrow transaction
CHAT#{chatId}          MSG#{ts}#{msgId}          Chat message
OTP#{phone}            OTP                      One-time password (TTL: 600s)
```

### GSI Indexes

- **GSI1** PK: `category`, SK: `createdAt` → browse by category
- **GSI2** PK: `sellerId`, SK: `createdAt` → seller's listings
- **GSI3** PK: `status`, SK: `createdAt` → admin moderation queue

### Core Types (lib/types.ts)

```typescript
// KYC Status
type KycStatus = 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED'

// User
interface User {
  userId: string           // Cognito sub
  phone: string            // +977XXXXXXXXXX
  name: string
  kycStatus: KycStatus
  nidHash: string          // SHA-256 of NID number — never store plain
  nidFrontKey: string      // S3 object key
  nidBackKey: string
  selfieKey: string
  esewaNumber?: string
  khaltiNumber?: string
  trustScore: number       // 0–100 (see formula below)
  completedSales: number
  completedPurchases: number
  avgRating: number        // 0–5
  city: string
  createdAt: string        // ISO 8601
}

// Listing
type Category = 'ELECTRONICS' | 'FASHION' | 'FURNITURE' | 'VEHICLES'
type Condition = 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'FOR_PARTS'
type ListingStatus = 'ACTIVE' | 'RESERVED' | 'SOLD' | 'DELETED'

interface Listing {
  listingId: string
  sellerId: string
  sellerName: string
  sellerTrustScore: number
  sellerVerified: boolean
  title: string
  description: string
  category: Category
  subcategory: string
  condition: Condition
  priceNPR: number         // Integer — never floats for money
  photoKeys: string[]      // S3 keys, min 3, max 10
  status: ListingStatus
  city: string
  views: number
  createdAt: string
  updatedAt: string
}

// Transaction (Escrow)
type TxnStatus =
  | 'PENDING_PAYMENT'
  | 'ESCROW_HELD'
  | 'DELIVERY_CONFIRMED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'CANCELLED'

interface Transaction {
  txnId: string
  buyerId: string
  sellerId: string
  listingId: string
  priceNPR: number
  platformFeeNPR: number   // 5% of price
  escrowFeeNPR: number     // Flat NPR 100
  totalNPR: number         // price + escrowFee (platformFee paid by seller)
  status: TxnStatus
  paymentMethod: 'ESEWA' | 'KHALTI'
  paymentRef: string       // Gateway transaction ID
  escrowDeadline: string   // 72h after ESCROW_HELD — ISO 8601
  createdAt: string
  updatedAt: string
}

// Chat
interface Message {
  chatId: string
  messageId: string
  senderId: string
  content: string
  type: 'TEXT' | 'OFFER' | 'SYSTEM'
  offerAmountNPR?: number  // Only for OFFER type
  read: boolean
  createdAt: string
}
```

---

## Business Rules

### Trust Score Formula

```typescript
function calcTrustScore(user: User): number {
  return Math.min(100,
    user.completedSales * 8 +
    user.completedPurchases * 4 +
    user.avgRating * 12 +
    (user.kycStatus === 'VERIFIED' ? 30 : 0)
  )
}
```

### Escrow State Machine

```
PENDING_PAYMENT
  → (eSewa/Khalti webhook fires) → ESCROW_HELD
  → (buyer confirms within 72h) → DELIVERY_CONFIRMED → COMPLETED
  → (72h passes, no action)    → auto-COMPLETED (cron Lambda)
  → (buyer raises dispute)     → DISPUTED → admin resolves
    → COMPLETED (seller wins) or REFUNDED (buyer wins)
```

### Money Rules

- All amounts stored as **integer NPR** (never paisa, never floats)
- Format for display: `formatNPR(amount)` → "NPR 12,500"
- Platform fee: 5% of listing price (deducted from seller payout)
- Escrow fee: flat NPR 100 (added to buyer total)
- Buyer pays: listingPrice + NPR 100
- Seller receives: listingPrice × 0.95

### Access Rules (who can do what)

- **Browse — open to everyone.** No auth, no KYC. Public + indexable.
- **Buy — open to everyone (guest checkout).** A buyer does NOT need an account or
  KYC. At checkout a guest provides name + phone so the seller can coordinate
  delivery and we can send escrow updates. (Buyers may optionally sign in to keep
  a purchase history.)
- **Sell — requires login + VERIFIED KYC.** A seller must be authenticated (phone
  OTP) and pass National-ID verification before they can create a listing.
  Listing creation routes (`/listing/new`, `/sell`) are gated: unauthenticated →
  login; authenticated but `kycStatus !== 'VERIFIED'` → KYC flow.

### KYC Rules (sellers only)

- Cannot list without VERIFIED KYC
- One account per NID number (enforced by nidHash uniqueness check)
- NID number hashed with SHA-256 + app-level salt before storage
- Selfie review is manual for Phase 1 (admin approves via admin panel)

### Listing Rules

- Minimum 3 photos required
- Photos must be uploaded via presigned S3 URLs
- Condition grade requires acknowledgement of photo standards
- LIKE_NEW: requires screen-on photo for electronics
- GOOD: all sides photographed
- FAIR: all damage clearly visible
- FOR_PARTS: broken parts specifically shown

### Chat Rules

- Phone numbers and emails detected by regex and blocked
- Replace with system message: "Sharing contact details bypasses
  your EverestBazar protection. Stay safe — use our platform."
- Chat initiated from listing detail page (tied to a listing)
- Message seller button visible to all VERIFIED users

---

## Payment Flows

### eSewa (Nepal's most used wallet)

eSewa uses a form POST redirect flow for web:

```
1. Buyer clicks "Pay with eSewa"
2. Our backend generates signed payment params
3. Client submits HTML form to eSewa gateway URL
4. eSewa redirects back to /api/webhooks/esewa with result
5. Our webhook verifies signature, updates transaction status
6. Redirect buyer to success/failure page
```

### Khalti (second most used wallet)

Khalti has a JS SDK (load via CDN):

```
1. Load Khalti Checkout widget
2. On success callback: send pidx to our backend
3. Backend calls Khalti verify API
4. Update transaction status
5. Redirect buyer to success/failure page
```

---

## API Structure

All API routes in `/app/api/` are thin proxies to Lambda.
They handle: auth cookie → Bearer token conversion, CORS, error mapping.

### Auth

```
POST /api/auth/send-otp        { phone }
POST /api/auth/verify-otp      { phone, otp }
POST /api/auth/logout          (clears httpOnly cookie)
GET  /api/auth/me              (from cookie) → User
```

### Listings

```
GET  /api/listings             ?category&city&condition&minPrice&maxPrice&cursor
POST /api/listings             CreateListingInput (requires VERIFIED)
GET  /api/listings/[id]
PUT  /api/listings/[id]        (owner only)
DELETE /api/listings/[id]      (owner only — soft delete)
```

### KYC

```
POST /api/kyc/presign-nid      → { frontUrl, backUrl } presigned S3 URLs
POST /api/kyc/presign-selfie   → { selfieUrl } presigned S3 URL
POST /api/kyc/submit           After uploads complete
GET  /api/kyc/status           → { status: KycStatus }
```

### Transactions

```
POST /api/transactions                  InitiatePurchase
GET  /api/transactions/[id]
POST /api/transactions/[id]/confirm     Buyer confirms delivery
POST /api/transactions/[id]/dispute     Buyer raises dispute
GET  /api/transactions/mine             ?as=buyer|seller
```

### Chat

```
GET  /api/chat                 All conversations for current user
GET  /api/chat/[chatId]        Messages (paginated)
POST /api/chat/[chatId]        Send message
WS   wss://api.everestbazar.com/chat   WebSocket (JWT in query param)
```

### Upload (direct to S3)

```
POST /api/upload/presign       { filename, contentType, purpose }
                               → { uploadUrl, key }
                               Client uploads directly to S3
                               Then sends key to listing create API
```

---

## Environment Variables

```bash
# Next.js public (safe to expose)
NEXT_PUBLIC_API_URL=https://api.everestbazar.com
NEXT_PUBLIC_WS_URL=wss://ws.everestbazar.com
NEXT_PUBLIC_CLOUDFRONT_URL=https://media.everestbazar.com
NEXT_PUBLIC_ESEWA_MERCHANT_CODE=
NEXT_PUBLIC_KHALTI_PUBLIC_KEY=

# Server only (never exposed to client)
JWT_SECRET=
JWT_REFRESH_SECRET=
ESEWA_SECRET_KEY=
KHALTI_SECRET_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# AWS (Lambda runtime)
AWS_REGION=ap-south-1
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
DYNAMODB_TABLE=EverestBazar-prod
S3_BUCKET=everestbazar-media-prod
CLOUDFRONT_DOMAIN=

# Admin
ADMIN_EMAIL=admin@everestbazar.com
ADMIN_SECRET=                         # For admin API route protection
```

---

## Code Standards

- **TypeScript strict** — no `any`, no `@ts-ignore`
- **No `useEffect` for data fetching** — use TanStack Query
- **Server Components by default** — add `'use client'` only when needed
- **All money as integer NPR** — `priceNPR: number`, never `price: number`
- **All dates as ISO 8601 strings** in API, format in component
- **All phone numbers with country code** — `+97798XXXXXXXX`
- **Error boundaries** on all route segments
- **Loading states** — every async action has a loading state
- **Optimistic updates** — for listing views, message read status
- **Accessibility** — all interactive elements keyboard navigable
- **No hardcoded colours** — use Tailwind tokens only

---

## What to Build (Phase 1 MVP)

**Category:** Electronics only
**Geography:** Kathmandu only
**Auth:** Phone OTP only (no social login)

### Must-have screens:

1. Landing page (public)
2. Login + OTP verify
3. KYC flow (NID upload + selfie + pending)
4. Browse listings (grid + filters)
5. Listing detail (photos + buy + message)
6. Create listing (multi-step)
7. Checkout + escrow payment (eSewa + Khalti)
8. Escrow status + confirm delivery
9. Dispute flow
10. Chat (list + thread)
11. Own profile (listings + purchases + sales)
12. Public profile (other users)
13. Admin KYC review (minimal — protected route)

### What to skip for Phase 1:

- Social login (Google, Facebook)
- Stripe (international payments)
- AI-based NID verification (manual admin review)
- Push notifications (use WhatsApp only for now)
- Delivery tracking integration
- Analytics dashboard
- Full admin panel (keep it minimal)

---

## Running Locally

```bash
npm install
cp .env.local.example .env.local
# Fill in .env.local values
npm run dev
# → http://localhost:3000

# Backend (separate terminal)
cd infra && sam build && sam local start-api --port 4000
```
