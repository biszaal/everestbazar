# Design System: EverestBazar — Verified Marketplace

> Source of truth for the ecommerce redesign. Implemented as CSS variables in
> `app/globals.css` (Tailwind v4 `@theme inline`). The goal: the site must read
> as a **trustworthy, product-forward marketplace** for the Nepali market —
> like a clean Vinted/Mercari — not an editorial brand site.

## 1. Visual Theme & Atmosphere

A crisp, confident **shopping** surface. Product imagery leads; chrome recedes.
Warm-neutral whites instead of the old cream so photos and prices pop. The mood
is **trustworthy and efficient** — every screen answers "what can I buy, for how
much, and is it safe?" within one glance.

- **Density:** 6 / 10 — Daily-app balanced, leaning dense. Tight product grids,
  compact trust chips, no wasted vertical space.
- **Variance:** 3 / 10 — **Predictable & symmetric on purpose.** Shoppers scan
  uniform grids; asymmetric/editorial layouts are *banned* for product surfaces.
- **Motion:** 4 / 10 — Fluid but restrained. Fast hover lifts, skeleton shimmer.
  No cinematic choreography, no parallax, no float loops on commerce surfaces.

## 2. Color Palette & Roles

Warm-neutral base + a single crimson accent (red reads as trustworthy and
familiar in Nepal — cf. Daraz/Hamrobazar). One accent only; warm grays throughout.

- **Canvas** (`#F7F6F3`) — page background, a barely-warm off-white
- **Surface** (`#FFFFFF`) — cards, header, product tiles, inputs
- **Raised** (`#F1EFEA`) — alternate sections, chips, track fills
- **Sunken** (`#E9E6DF`) — skeleton base, avatar wells
- **Ink** (`#211B16`) — primary text + dark sections (warm near-black, never `#000`)
- **Ink-2** (`#4A423B`) — secondary text
- **Ink-soft** (`#857B70`) — metadata, labels, placeholders
- **Hairline** (`rgba(33,27,22,0.09)`) — 1px structural borders (crisp, light)
- **Crimson** (`#BE3A2B`) — PRIMARY: CTAs, prices, active states, focus rings
- **Crimson-dark** (`#9F2C20`) — hover
- **Green** (`#3F7D52`) — verified / success only
- **Steel** (`#3E6E86`) — escrow / locked states only
- **Gold** (`#C9962F`) — ratings only

Prayer-flag five (`#2C6FB3 #FBF7EE #C0392B #2E7D52 #E3A92B`) — retained ONLY as
the 3px hairline motif at the header top. Never as fills.

## 3. Typography Rules

Keep the project's distinctive (non-Inter) stack, used more soberly for a shop.

- **Display** — Bricolage Grotesque, weight 700–800, `letter-spacing:-0.02em`.
  Reserved for the logo, page titles, section headers, and **prices**. Smaller,
  tighter than the old editorial scale — hierarchy by weight/color, not size.
- **Body / UI** — Hanken Grotesk, 15–16px, line-height 1.5. All product text,
  controls, nav, descriptions.
- **Mono** — IBM Plex Mono, uppercase, tracked. Eyebrows, tiny meta labels only.
- **Nepali** — Noto Sans Devanagari; `:lang(ne)` bumps line-height.
- Prices: display weight 800, crimson, prominent — the loudest element on a card.
- **Banned:** Inter; generic serifs; screaming oversized H1s.

## 4. Header (the #1 ecommerce signal)

- **Persistent search bar is the dominant header element** — center, full-width,
  pill, search icon, placeholder cycling product examples ("iPhone 13", "study
  table"…). On every page.
- Logo left (compact mark + wordmark). Right: language toggle, Log in / Sign up,
  crimson **Sell** button.
- **Category strip** directly under the search row: All · Mobiles · Electronics ·
  Vehicles · Furniture · Home · Fashion. Horizontal-scroll on mobile.
- 3px prayer-flag hairline pinned at the very top.
- Mobile: search stays prominent; categories scroll; bottom tab bar persists.

## 5. Homepage (product-forward, NOT an editorial hero)

Order: compact trust strip (search + "Verified sellers · Escrow-protected ·
Kathmandu" chips, small) → **category tiles** → **product grid** ("Fresh
listings") as the dominant block → compact 3-step escrow trust band → seller CTA.
The old full-screen "Secondhand goods / Zero scams" editorial hero is retired.

## 6. Component Stylings

- **Product card:** white surface, 14px radius, hairline border, subtle shadow;
  image-forward (4:3, real photo) with a small condition chip overlay and a
  save/heart toggle top-right. Body: title (1–2 lines, clamped), **crimson price
  (loudest)**, location · rating, a compact verified chip. Hover: lift
  `translateY(-2px)` + slightly stronger shadow. Whole card is the link.
- **Buttons:** flat crimson primary, **no colored outer glow** (skill: no neon);
  tactile `translateY(1px)` on press. Ghost = 1px ink outline. Pill radius.
- **Cards/containers:** 14–16px radius (tighter than the old 22px boutique feel),
  diffuse low shadow tinted to ink. Cards only where elevation = hierarchy.
- **Inputs:** white fill, hairline border, crimson focus ring, label above.
- **Loaders:** existing shimmer skeletons matching layout (already in place).
- **Empty states:** composed message + a clear "Browse all" action.

## 7. Layout Principles

- **Uniform CSS-grid product grids:** 2 cols mobile · 3 tablet · 4–5 desktop.
  Equal tiles. No masonry, no asymmetry on commerce surfaces.
- Max-width container 1280px, centered. Section padding compact (~56–64px).
- Mobile-first: every multi-column grid collapses to a clean column set; no
  horizontal page scroll; 44px min tap targets.
- `min-h-[100dvh]` for any full-height area; never `h-screen`.

## 8. Motion & Interaction

- Hover lifts and shadow transitions via `transform`/`opacity` only, ~140ms.
- Skeleton shimmer for loads (no spinners). Staggered grid reveal is optional and
  subtle. No perpetual float/parallax on shopping surfaces (reserved, if ever,
  for the brand splash).

## 9. Anti-Patterns (Banned)

No emojis · no Inter · no generic serifs · no pure black · no neon/colored outer
glows on buttons · no oversaturated accents · no gradient text on large headers ·
no custom cursors · no overlapping elements · no asymmetric/editorial product
layouts · no 3-equal-marketing-card rows · no AI copy clichés ("Elevate",
"Seamless") · no generic placeholder names · no broken Unsplash links.
