# GolfGive Project Explanation Guide

This document explains the GolfGive project in simple language so you can confidently present it to a company. It covers:

- What the client wanted in the PRD.
- How we planned to build it.
- How the UI system shaped the design.
- How the actual codebase is structured.
- How the main flows work: signup, subscription, scores, charity, draws, winners, admin.
- What is complete, what is partial, and what you should be ready to explain.

---

## 1. One-Line Project Summary

GolfGive is a subscription-based golf platform where users pay monthly or yearly, enter their latest golf scores, support a charity, and participate in monthly prize draws.

In very simple words:

> Users subscribe, add 5 golf scores, choose a charity, and every month those scores are compared against draw numbers. If they match 3, 4, or 5 numbers, they can win a prize. A part of their subscription also goes to charity.

---

## 2. What The Client Wanted In The PRD

The PRD describes a full-stack web application for a trainee selection assignment. The client wants to evaluate whether we can understand requirements, design a complete system, build clean code, manage data correctly, and create a polished UI.

### 2.1 Main Product Idea

The product combines 3 things:

1. Golf performance tracking.
2. Charity giving.
3. Monthly prize draws.

The product should not look like a normal golf website. The PRD specifically says the design should feel modern, emotional, and charity-led, not like fairways, clubs, plaid clothing, or a traditional sports site.

### 2.2 User Roles

There are 3 user roles.

| Role | What They Can Do |
|---|---|
| Public Visitor | View landing page, understand the concept, explore charities, start subscription |
| Registered Subscriber | Manage profile, enter scores, choose charity, view winnings, upload winner proof |
| Administrator | Manage users, subscriptions, draws, charities, winners, payouts, and analytics |

### 2.3 Subscription Requirement

The client wants a paid membership system.

Users should be able to choose:

- Monthly plan.
- Yearly plan.

Stripe, or another PCI-compliant payment provider, should handle payments.

The system should track subscription states:

- `active`
- `inactive`
- `cancelled`
- `lapsed`

The PRD says subscription status should be checked whenever users access protected features.

### 2.4 Score Management Requirement

Each subscriber enters their latest golf scores in Stableford format.

Rules:

- Score must be between 1 and 45.
- Every score must have a date.
- Only the latest 5 scores are retained.
- One score per date only.
- Scores should display newest first.
- If the user adds a 6th score, the oldest score should be removed automatically.

### 2.5 Draw And Reward Requirement

Every month, the admin runs a prize draw.

The platform supports two draw styles:

| Draw Type | Meaning |
|---|---|
| Random | Standard lottery-style random numbers |
| Algorithmic | Weighted draw based on common or uncommon user scores |

Users can win based on how many of their 5 scores match the drawn numbers.

| Match Count | Result |
|---|---|
| 5 matches | Jackpot prize |
| 4 matches | Second prize tier |
| 3 matches | Third prize tier |
| 0-2 matches | No prize |

The admin must be able to:

1. Configure the draw.
2. Run a simulation first.
3. Review possible results.
4. Publish final results.
5. Trigger winner records and notifications.

### 2.6 Prize Pool Requirement

The prize pool comes from subscription revenue.

The PRD distribution is:

| Tier | Share |
|---|---|
| 5-match jackpot | 40% |
| 4-match winners | 35% |
| 3-match winners | 25% |

If nobody wins the 5-match jackpot, that jackpot amount rolls over to the next month.

### 2.7 Charity Requirement

Each user selects a charity.

Rules:

- User chooses a charity during signup or later in dashboard.
- Minimum 10% of their subscription fee goes to charity.
- User can increase the percentage.
- Public visitors can browse the charity directory.
- Admin can manage charity listings.

### 2.8 Winner Verification Requirement

Only winners need verification.

Flow:

1. User wins a prize.
2. User uploads proof, such as score screenshot.
3. Admin reviews proof.
4. Admin approves or rejects.
5. If approved, payout status can become paid.

### 2.9 Dashboard Requirement

The user dashboard must show:

- Subscription status.
- Score entry/edit interface.
- Selected charity and contribution percentage.
- Participation summary.
- Winnings overview.

### 2.10 Admin Dashboard Requirement

The admin dashboard must include:

- User management.
- Draw management.
- Charity management.
- Winner management.
- Reports and analytics.

### 2.11 UI/UX Requirement

The PRD strongly focuses on UI quality.

The app should feel:

- Modern.
- Emotional.
- Motion-enhanced.
- Charity-impact driven.
- Premium.

It should avoid:

- Generic golf visuals.
- Traditional golf cliches.
- Boring dashboards.
- Weak calls to action.

---

## 3. How We Decided To Build It

The build plan chooses a modern full-stack architecture.

### 3.1 Chosen Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js App Router | Handles pages, layouts, server rendering, and API routes |
| Language | TypeScript | Safer code and better developer experience |
| Styling | Tailwind CSS | Fast responsive UI styling |
| Auth | Supabase Auth | Login, signup, sessions |
| Database | Supabase PostgreSQL | Relational database with security policies |
| Payments | Stripe | Subscription checkout and webhooks |
| Emails | Resend | Transactional email templates |
| Realtime | Supabase Realtime | Live dashboard refreshes |
| Testing | Playwright | End-to-end and API behavior tests |
| Deployment Target | Vercel + Supabase | Common stack for Next.js apps |

### 3.2 High-Level Architecture

```text
Visitor / Subscriber / Admin
          |
          v
Next.js App Router
          |
          +--> Public pages: landing, charities, subscribe
          |
          +--> Protected pages: dashboard, admin
          |
          +--> API routes: scores, draw, Stripe, user, charities
          |
          v
Supabase
          |
          +--> Auth sessions
          +--> PostgreSQL tables
          +--> Row Level Security
          +--> Storage for winner proof files
          +--> Realtime table updates

Stripe
  |
  +--> Checkout
  +--> Subscription webhooks

Resend
  |
  +--> Draw result emails
  +--> Winner alert emails
```

### 3.3 Main App Sections

```text
src/app
  page.tsx                         Public landing page
  subscribe/page.tsx                Subscription plan selection
  charities/page.tsx                Public charity directory
  charities/[id]/page.tsx           Charity profile
  (dashboard)/dashboard             Subscriber dashboard
  (admin)/admin                     Admin panel
  api                               Backend route handlers
```

---

## 4. UI System Explanation

The UI system defines how the product should look and feel.

### 4.1 Brand Direction

Product name: GolfGive  
Tagline: Play. Give. Win.

The UI should feel like:

- Premium fintech.
- Charity campaign.
- Dark luxury.
- Modern and emotional.

It should not feel like:

- A traditional golf club website.
- A green fairway website.
- A simple template.

### 4.2 Color System

The design uses a dark background with a bright lime accent.

| Color | Usage |
|---|---|
| `#0a0a14` | Main background |
| `#111120` | Cards and panels |
| `#1c1c30` | Hover/elevated surfaces |
| `#b8f55a` | Main CTA, success, active state |
| `#f5c842` | Jackpot/prize moments only |
| `#ff6b4a` | Error/danger |
| `#9595b5` | Muted text |

### 4.3 Typography

The UI system asks for:

- Playfair Display for headings.
- DM Sans for body/UI.
- JetBrains Mono for code-like/stat details.

In the current code:

- `src/app/layout.tsx` loads `DM Sans` and `Playfair Display`.
- Some local Geist fonts are also still loaded.

### 4.4 Design Rules Used In Code

The code follows the UI system by using:

- Dark page backgrounds.
- Lime CTA buttons.
- Gold for prize/winner sections.
- Rounded cards.
- Uppercase section labels.
- Motion through GSAP and Framer Motion.
- Dashboard/sidebar layout for repeated use.

---

## 5. Actual Codebase Overview

### 5.1 Root Files

| File | Purpose |
|---|---|
| `package.json` | Dependencies and scripts |
| `next.config.mjs` | Next.js config |
| `tailwind.config.ts` | Tailwind theme |
| `playwright.config.ts` | E2E test config |
| `.env.local` | Local secrets, not committed |
| `.env.example` | Example environment variables |

### 5.2 Main Source Folders

| Folder | Purpose |
|---|---|
| `src/app` | Next.js pages, layouts, and API routes |
| `src/components` | Reusable UI components |
| `src/contexts` | React context, mainly auth modal state |
| `src/lib` | Supabase, Stripe, draw engine, email helpers |
| `supabase/migrations` | SQL schema, RLS policies, storage, seed/test setup |
| `e2e` | Playwright tests |
| `documentation` | PRD, build plan, UI system, this guide |

---

## 6. Database Design

The database is defined in Supabase migrations.

Main file:

```text
supabase/migrations/20260428120000_create_golfgive_core_schema.sql
```

Security policies:

```text
supabase/migrations/20260428121000_create_golfgive_rls.sql
```

Realtime:

```text
supabase/migrations/20260429060000_enable_realtime.sql
```

### 6.1 Core Tables

| Table | What It Stores |
|---|---|
| `users` | App profile for each Supabase auth user |
| `scores` | User golf scores |
| `charities` | Charity directory records |
| `charity_events` | Charity events such as golf days |
| `draws` | Monthly draw records |
| `draw_entries` | Each user's entry snapshot for a draw |
| `winners` | Winners, proof, verification, payout status |
| `subscriptions` | Stripe subscription audit/history |

### 6.2 Important Enums

| Enum | Values |
|---|---|
| `app_role` | `subscriber`, `admin` |
| `subscription_status` | `active`, `inactive`, `cancelled`, `lapsed` |
| `subscription_plan` | `monthly`, `yearly` |
| `draw_mode` | `random`, `algorithmic` |
| `draw_status` | `scheduled`, `simulation`, `published` |
| `prize_tier` | `three_match`, `four_match`, `five_match` |
| `verification_status` | `pending`, `approved`, `rejected` |
| `payment_status` | `pending`, `paid` |

### 6.3 Score Limit Trigger

The database has a trigger called `enforce_score_limit`.

Its job:

1. A user inserts a new score.
2. The trigger checks all scores for that user.
3. It keeps only the latest 5 by date.
4. It deletes older scores.

This is good because the 5-score rule is enforced at database level, not only in frontend code.

### 6.4 New User Trigger

The database has a trigger called `handle_new_user`.

When Supabase Auth creates a user, this trigger creates a matching row in the public `users` table.

This gives the app a profile row where we can store:

- Full name.
- Email.
- Role.
- Subscription status.
- Charity selection.
- Charity percentage.

### 6.5 Row Level Security

RLS policies are enabled on all core tables.

Simple explanation:

> RLS means users can only access rows they are allowed to access. A subscriber can read/manage their own scores, but not another user's scores. Admins can manage all records.

Examples:

- A user can manage their own scores.
- A user can read their own profile.
- Admins can manage all users, scores, draws, winners, charities.
- Public visitors can read active charities and published draws.

---

## 7. Authentication Flow

Main files:

```text
src/components/auth/AuthModal.tsx
src/contexts/AuthContext.tsx
src/app/api/auth/callback/route.ts
src/middleware.ts
src/lib/supabase/middleware.ts
```

### 7.1 How Login/Signup Works

```text
User clicks Login or Sign Up
        |
        v
AuthModal opens
        |
        v
Supabase Auth handles email/password
        |
        v
Supabase creates session cookies
        |
        v
App checks user role
        |
        +--> admin goes to /admin
        |
        +--> subscriber goes to /dashboard
```

### 7.2 AuthModal

`AuthModal.tsx` is a client component.

It handles:

- Login form.
- Signup form.
- Full name collection during signup.
- Email/password authentication with Supabase.
- Redirect after login based on user role.

Important detail:

- Google auth button exists visually.
- It currently shows a message saying Google auth is not implemented.

### 7.3 AuthContext

`AuthContext.tsx` controls whether the auth modal is open.

It also reads the URL query:

```text
/?auth=login
/?auth=signup
```

So middleware can redirect unauthenticated users to the home page and automatically open the login modal.

### 7.4 Middleware Protection

`src/middleware.ts` calls `updateSession`.

`src/lib/supabase/middleware.ts` does the real work:

- Refreshes Supabase session cookies.
- Redirects unauthenticated dashboard/admin users to `/?auth=login`.
- Checks admin role before allowing `/admin`.
- Redirects non-admin users to `/dashboard`.

---

## 8. Public Landing Page

Main file:

```text
src/app/page.tsx
```

The landing page is composed from sections:

```text
Preloader
Navbar
Hero
StatsBar
HowItWorks
PrizePool
CharityShowcase
DrawMechanics
SocialMarquee
SubscriptionCTA
Footer
```

### 8.1 Landing Page Goal

The landing page answers:

1. What is GolfGive?
2. How does a user participate?
3. How do they win?
4. How does charity giving work?
5. Where do they subscribe?

### 8.2 Hero Section

Main file:

```text
src/components/landing/Hero.tsx
```

The hero message:

> Golf that changes lives.

It includes:

- Dark premium background.
- Lime CTA.
- Animated headline using GSAP.
- A mock score card on desktop.

### 8.3 How It Works Section

Main file:

```text
src/components/landing/HowItWorks.tsx
```

It explains the product in 3 simple steps:

1. Subscribe.
2. Enter 5 Stableford scores.
3. Win and give through monthly draws.

---

## 9. Subscription And Stripe Flow

Main files:

```text
src/app/subscribe/page.tsx
src/app/api/stripe/checkout/route.ts
src/app/api/stripe/webhook/route.ts
src/app/api/stripe/portal/route.ts
src/lib/stripe/index.ts
```

### 9.1 User Subscription Flow

```text
User visits /subscribe
        |
        v
Chooses monthly or yearly plan
        |
        v
Clicks Secure Checkout
        |
        v
If not logged in, auth modal opens
        |
        v
If logged in, app calls /api/stripe/checkout
        |
        v
Stripe Checkout session is created
        |
        v
User pays on Stripe
        |
        v
Stripe sends webhook to /api/stripe/webhook
        |
        v
Supabase user subscription_status becomes active
```

### 9.2 Checkout Route

`/api/stripe/checkout`:

- Requires a logged-in user.
- Receives a Stripe price ID.
- Creates a Stripe subscription checkout session.
- Passes `client_reference_id` as the user ID.

That `client_reference_id` is important because the webhook later knows which app user paid.

### 9.3 Webhook Route

`/api/stripe/webhook`:

- Validates Stripe webhook signature.
- Uses Supabase service role key because webhook has no logged-in user session.
- Handles important events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

When checkout completes:

- `users.subscription_status` becomes `active`.
- `users.subscription_id` is saved.
- `users.subscription_plan` becomes `monthly` or `yearly`.
- A row is inserted into `subscriptions`.

When subscription fails or is cancelled:

- User status becomes `lapsed` or `cancelled`.

### 9.4 Billing Portal

`/api/stripe/portal`:

- Finds the user's latest Stripe customer ID.
- Creates a Stripe customer portal session.
- Sends the user to Stripe to manage billing.

---

## 10. Score Management Flow

Main files:

```text
src/components/dashboard/ScoreEntry.tsx
src/components/dashboard/ScoreList.tsx
src/app/api/scores/route.ts
src/app/api/scores/[id]/route.ts
```

### 10.1 User Score Flow

```text
User opens dashboard
        |
        v
ScoreEntry fetches /api/scores
        |
        v
User enters date + Stableford score
        |
        v
POST /api/scores
        |
        v
API validates score is 1-45 and user is logged in
        |
        v
Supabase inserts score
        |
        v
Database trigger keeps latest 5 only
        |
        v
UI refreshes score list
```

### 10.2 Score API

`GET /api/scores`:

- Checks logged-in user.
- Returns only that user's scores.
- Orders by newest score date first.

`POST /api/scores`:

- Checks logged-in user.
- Requires `score` and `score_date`.
- Validates score range 1-45.
- Inserts the score.
- Handles duplicate date error.

`PATCH /api/scores/[id]`:

- Updates a score or date.
- Ensures the score belongs to current user.
- Validates score range.
- Handles duplicate date error.

`DELETE /api/scores/[id]`:

- Deletes a score.
- Ensures the score belongs to current user.

### 10.3 UI Components

`ScoreEntry`:

- Shows the form.
- Fetches scores.
- Submits new scores.
- Triggers refresh after changes.

`ScoreList`:

- Displays existing scores.
- Allows inline edit.
- Allows delete with confirmation modal.

---

## 11. Charity System Flow

Main files:

```text
src/app/charities/page.tsx
src/app/charities/[id]/page.tsx
src/components/dashboard/CharityModule.tsx
src/app/api/charities/route.ts
src/app/api/user/charity/route.ts
```

### 11.1 Public Charity Directory

`/charities`:

- Shows all active charities.
- Has search input.
- Links to individual charity pages.

`/charities/[id]`:

- Shows charity profile.
- Shows image, description, website link.
- Has CTA to select charity in dashboard.

### 11.2 Dashboard Charity Flow

```text
User opens dashboard charity module
        |
        v
Frontend fetches /api/charities and /api/user/profile
        |
        v
User selects a charity
        |
        v
User chooses contribution percentage from 10 to 100
        |
        v
PATCH /api/user/charity
        |
        v
users.charity_id and users.charity_percentage update
```

### 11.3 API Rules

`PATCH /api/user/charity`:

- Requires logged-in user.
- Allows updating charity ID.
- Allows updating charity percentage.
- Validates percentage between 10 and 100.

The database also enforces the 10-100 percentage range.

---

## 12. Draw Engine

Main files:

```text
src/lib/draw-engine/random.ts
src/lib/draw-engine/weighted.ts
src/lib/draw-engine/matcher.ts
src/lib/draw-engine/prize.ts
src/app/api/draw/simulate/route.ts
src/app/api/draw/publish/route.ts
```

### 12.1 Random Draw

`random.ts` exports:

```text
drawRandomNumbers(count = 5, max = 45)
```

It:

- Creates a set of unique random numbers.
- Keeps adding numbers until it has 5.
- Sorts them ascending.

### 12.2 Weighted Draw

`weighted.ts` exports:

```text
calculateFrequencies(allScores)
drawWeightedNumbers(frequencies)
```

It:

- Counts how often each score appears.
- Builds a weighted pool.
- Numbers with higher frequency appear more times in the pool.
- Draws numbers from that weighted pool.

Current implementation note:

- The weighted draw library exists.
- The current `/api/draw/simulate` and `/api/draw/publish` flow mainly uses random draw numbers.
- The admin UI lets the admin select algorithmic mode visually, but the selected mode is not fully passed through and used in the backend publish flow yet.

This is a good interview talking point:

> The architecture already separates random and weighted draw logic, so completing algorithmic mode means wiring the admin mode selection into the simulate/publish API and using `drawWeightedNumbers` when mode is `algorithmic`.

### 12.3 Match Logic

`matcher.ts` exports:

```text
matchScores(userScores, drawNumbers)
evaluateEntries(entries, drawNumbers)
```

It:

- Compares each user's 5 scores to the drawn numbers.
- Counts how many match.
- Counts total users with 3, 4, and 5 matches.

### 12.4 Prize Calculation

`prize.ts` exports:

```text
calculatePrizePool(totalRevenue, rollover, matchCounts)
```

Current default config:

```text
5-match: 40%
4-match: 15%
3-match: 5%
charity: 20%
platform: 20%
```

Important note:

- The PRD says prize tiers should be 40%, 35%, and 25%.
- The current `prize.ts` splits total subscription revenue into prize, charity, and platform portions.
- Admin publish flow also supports a manual prize pool split of 50/30/20 by default.

How to explain this:

> The code separates revenue allocation from prize distribution. For a production-ready version, we would align final percentages exactly with the PRD: 40/35/25 for prize tiers, while charity/platform allocation would be defined separately.

### 12.5 Draw Simulation Flow

`POST /api/draw/simulate`:

```text
Admin clicks Run Simulation
        |
        v
API fetches all scores
        |
        v
Groups scores by user
        |
        v
Keeps users who have 5 scores
        |
        v
Generates 5 random draw numbers
        |
        v
Evaluates matches
        |
        v
Calculates projected prize distribution
        |
        v
Returns preview only
```

Important:

- Simulation does not write draw results to database.
- It only previews.

### 12.6 Draw Publish Flow

`POST /api/draw/publish`:

```text
Admin confirms draw
        |
        v
API validates 5 unique draw numbers between 1 and 45
        |
        v
Fetches all user scores with user email/name
        |
        v
Groups latest 5 scores per user
        |
        v
Evaluates matches
        |
        v
Calculates prize distribution
        |
        v
Creates or updates current month's draw
        |
        v
Deletes existing entries if re-publishing
        |
        v
Creates draw_entries for each valid user
        |
        v
Creates winners for 3+ matches
        |
        v
Sends draw result and winner emails if Resend is configured
```

### 12.7 Draw Data Model

```text
draws
  id
  draw_month
  draw_mode
  drawn_numbers
  status
  jackpot_rollover
  prize_pool_total

draw_entries
  draw_id
  user_id
  user_scores
  match_count
  is_winner
  prize_tier

winners
  draw_entry_id
  user_id
  prize_amount
  proof_url
  verification_status
  payment_status
```

---

## 13. Subscriber Dashboard

Main route:

```text
src/app/(dashboard)/dashboard
```

Main layout:

```text
src/app/(dashboard)/layout.tsx
```

Main components:

```text
Sidebar
DashboardHeader
RealtimeProvider
LatestResults
ScoreEntry
CharityModule
SubscriptionCard
ParticipationSummary
WinningsOverview
```

### 13.1 Dashboard Layout

The dashboard has:

- Left sidebar on desktop.
- Mobile menu on small screens.
- Top header.
- Main content area.
- Realtime refresh wrapper.

### 13.2 Dashboard Pages

| Page | Purpose |
|---|---|
| `/dashboard` | Main overview |
| `/dashboard/scores` | Score management |
| `/dashboard/charity` | Charity selection and contribution |
| `/dashboard/prizes` | Latest draw and winnings |
| `/dashboard/settings` | Account/subscription settings |

### 13.3 Dashboard Overview

`src/app/(dashboard)/dashboard/page.tsx` shows:

- Latest draw results.
- Score entry form.
- Charity module.
- Subscription status.
- Participation summary.
- Winnings overview.

### 13.4 SubscriptionCard

Shows:

- Subscription status.
- Current plan.
- Renewal date.
- Manage subscription button.

Current implementation note:

- `isSubscribed` currently has `|| true`, so the UI always shows active.
- Stripe data still exists in backend, but this UI line should be fixed for production.

### 13.5 ParticipationSummary

Shows:

- Next draw date.
- Number of scores entered.
- Eligibility status.

Simple rule:

> If the user has 5 scores, they are eligible. If not, they need more scores.

### 13.6 LatestResults

Fetches:

```text
/api/user/latest-draw
```

Shows:

- Latest published draw numbers.
- Which numbers matched the user's scores.
- Match count.
- Prize won display.

Current implementation note:

- `prize_won` is currently simplified in latest draw API.
- Real prize amount is available from the `winners` table and shown in winnings overview.

### 13.7 WinningsOverview

Fetches:

```text
/api/user/winnings
```

Shows:

- Total lifetime winnings.
- Individual winner rows.
- Payment status.
- Proof upload button.

Proof upload uses Supabase Storage bucket:

```text
winner-proofs
```

Current implementation note:

- File upload uploads to storage.
- The code currently shows success alert but does not fully update the winner row with `proof_url` after upload.

---

## 14. Realtime Updates

Main files:

```text
src/components/dashboard/RealtimeProvider.tsx
supabase/migrations/20260429060000_enable_realtime.sql
```

Realtime provider subscribes to table changes:

- `scores`
- `draws`
- `draw_entries`
- `winners`
- `subscriptions`
- `charities`

When a watched table changes:

1. Supabase sends a realtime event.
2. The provider increments `refreshKey`.
3. Dashboard components using `refreshKey` refetch their data.

Simple explanation:

> Instead of manually refreshing the page, the dashboard knows when important database tables change and reloads the relevant data.

---

## 15. Admin Panel

Main route:

```text
src/app/(admin)/admin
```

Main layout:

```text
src/app/(admin)/layout.tsx
```

Admin protection happens in:

- Middleware.
- Admin layout.

### 15.1 Admin Layout

The admin layout shows:

- Gold warning bar: "Admin Environment Active".
- Admin sidebar.
- Dashboard header.
- Protected admin content.

The gold bar is intentional from the UI system:

> Gold signals admin/prize/high-impact context.

### 15.2 Admin Pages

| Page | Purpose |
|---|---|
| `/admin` | Platform metrics and quick actions |
| `/admin/users` | User list, search, role management |
| `/admin/users/[id]` | User profile details |
| `/admin/draws` | List previous/current draws |
| `/admin/draws/new` | Configure, simulate, publish draw |
| `/admin/draws/[id]` | Draw detail and entries |
| `/admin/charities` | Manage charity listings |
| `/admin/charities/new` | Add charity |
| `/admin/winners` | Review winner list |
| `/admin/winners/[id]` | Approve/reject winner proof and payout |

### 15.3 Admin Overview

`/admin` shows:

- Total users.
- Total prize pool.
- Active charities.
- Total draws.
- Pending winner alerts.
- Recent users.
- Quick actions.

### 15.4 Admin Users

`/admin/users`:

- Lists users.
- Supports search by name/email.
- Shows subscription status.
- Shows role.
- Shows selected charity and contribution percentage.
- Links to user detail page.

`InlineRoleToggle` allows admin role changes.

Current implementation note:

- Database enum uses `subscriber` and `admin`.
- Some admin UI code toggles to `user`, which does not match the enum.
- Production fix: use `subscriber` instead of `user`.

### 15.5 Admin Draws

`/admin/draws`:

- Lists all draws.
- Shows status, mode, prize pool, drawn numbers.
- Links to details or simulate/publish.

`/admin/draws/new`:

- Lets admin select random or algorithmic mode.
- Lets admin choose auto or manual prize pool.
- Runs simulation.
- Publishes draw.

Current implementation note:

- UI mode selection exists.
- Backend currently publishes `draw_mode: "random"` in the publish API.
- Weighted mode still needs final backend wiring.

### 15.6 Admin Charity Management

`/admin/charities`:

- Lists charities as cards.
- Shows featured/active state.
- Shows supporter count.
- Uses `CharityAdminActions`.

`/admin/charities/new`:

- Form to add charity.

Current implementation note:

- The database table uses `website` and `image_url`.
- The new charity page inserts `website_url` and `logo_url`.
- Production fix: rename those insert fields to match the schema.

### 15.7 Admin Winners

`/admin/winners`:

- Lists winners.
- Shows draw month.
- Shows prize.
- Shows verification status.
- Shows payout status.

`/admin/winners/[id]`:

- Shows winner details.
- Shows proof upload link if available.
- Allows reject.
- Allows approve and mark paid if proof exists.

---

## 16. Email System

Main files:

```text
src/lib/emails/resend.ts
src/lib/emails/templates/WelcomeEmail.tsx
src/lib/emails/templates/DrawResultsEmail.tsx
src/lib/emails/templates/WinnerAlertEmail.tsx
```

The email helper supports:

- Welcome email.
- Draw results email.
- Winner alert email.

In publish draw flow:

1. Every participant can receive draw result email.
2. Winners receive winner alert email.

Emails are only sent if:

```text
RESEND_API_KEY
```

exists in environment variables.

---

## 17. Environment Variables

The build plan requires:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=

NEXT_PUBLIC_APP_URL=

RESEND_API_KEY=
EMAIL_FROM=
```

Important security explanation:

- `NEXT_PUBLIC_*` variables can be used in browser code.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser.
- Stripe webhook secret must stay server-side.

---

## 18. Testing

Main files:

```text
e2e/auth-and-dashboard.spec.ts
e2e/api-logic.spec.ts
e2e/full-suite.spec.ts
playwright.config.ts
```

Tests cover:

- Homepage visibility.
- Subscribe page pricing.
- Protected dashboard/admin redirects.
- Unauthorized score API behavior.
- Draw simulation shape/math when accessible.
- Mobile responsiveness check.
- Error handling on malformed draw publish.

Important note:

- Some tests are high-level and flexible because real Supabase auth and Stripe flows need proper test credentials and external services.

---

## 19. Step-By-Step: How The Code Was Built According To The Build Plan

### Phase 1: Project Setup And Infrastructure

What we did:

- Created a Next.js app with TypeScript.
- Added Tailwind CSS.
- Added app router structure.
- Installed Supabase, Stripe, Resend, Framer Motion, GSAP, Playwright, and utility libraries.
- Added Supabase client helpers:
  - Browser client.
  - Server client.
  - Middleware session updater.
- Added SQL migrations for schema, RLS, storage, test credentials, and realtime.

Important files:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/middleware.ts
supabase/migrations/*
```

### Phase 2: Authentication

What we did:

- Created a modal-based login/signup flow.
- Used Supabase email/password auth.
- Added auth callback route.
- Added middleware protection for dashboard and admin.
- Added user profile creation through database trigger.

Important files:

```text
src/components/auth/AuthModal.tsx
src/contexts/AuthContext.tsx
src/app/api/auth/callback/route.ts
src/middleware.ts
```

### Phase 3: Subscription And Stripe

What we did:

- Built subscription selection page.
- Added monthly/yearly plan UI.
- Added Stripe checkout API.
- Added Stripe webhook API.
- Added Stripe portal API for billing management.
- Stored subscription history in Supabase.

Important files:

```text
src/app/subscribe/page.tsx
src/app/api/stripe/checkout/route.ts
src/app/api/stripe/webhook/route.ts
src/app/api/stripe/portal/route.ts
src/lib/stripe/index.ts
```

### Phase 4: Score Management

What we did:

- Created score entry UI.
- Created score list UI with edit/delete.
- Added API routes for create, read, update, delete.
- Added server validation.
- Added DB unique constraint for one score per date.
- Added DB trigger to keep latest 5 scores.

Important files:

```text
src/components/dashboard/ScoreEntry.tsx
src/components/dashboard/ScoreList.tsx
src/app/api/scores/route.ts
src/app/api/scores/[id]/route.ts
supabase/migrations/20260428120000_create_golfgive_core_schema.sql
```

### Phase 5: Charity System

What we did:

- Created charity database table.
- Created public charity directory.
- Created individual charity profile page.
- Created dashboard charity selector.
- Added user charity update API.
- Added admin charity listing.

Important files:

```text
src/app/charities/page.tsx
src/app/charities/[id]/page.tsx
src/components/dashboard/CharityModule.tsx
src/app/api/charities/route.ts
src/app/api/user/charity/route.ts
src/app/(admin)/admin/charities/page.tsx
```

### Phase 6: Draw Engine

What we did:

- Added random number draw logic.
- Added weighted draw helper logic.
- Added match evaluation logic.
- Added prize pool calculation logic.
- Added simulation API.
- Added publish API.
- Added draw entries and winners creation.
- Added jackpot rollover support in calculation.

Important files:

```text
src/lib/draw-engine/random.ts
src/lib/draw-engine/weighted.ts
src/lib/draw-engine/matcher.ts
src/lib/draw-engine/prize.ts
src/app/api/draw/simulate/route.ts
src/app/api/draw/publish/route.ts
```

### Phase 7: User Dashboard

What we did:

- Built dashboard layout with sidebar/header.
- Added subscription status card.
- Added score entry module.
- Added charity module.
- Added participation summary.
- Added latest draw results.
- Added winnings overview.
- Added proof upload UI.
- Added realtime refresh provider.

Important files:

```text
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/components/dashboard/*
```

### Phase 8: Admin Panel

What we did:

- Built admin layout with role protection.
- Added admin overview metrics.
- Added user listing and user details.
- Added role toggle actions.
- Added draw management pages.
- Added charity management pages.
- Added winner review and payout pages.

Important files:

```text
src/app/(admin)/layout.tsx
src/app/(admin)/admin/page.tsx
src/app/(admin)/admin/users/page.tsx
src/app/(admin)/admin/draws/page.tsx
src/app/(admin)/admin/draws/new/page.tsx
src/app/(admin)/admin/charities/page.tsx
src/app/(admin)/admin/winners/page.tsx
```

### Phase 9: Landing Page And Public Pages

What we did:

- Built animated landing page.
- Added premium dark theme.
- Added hero, stats, how it works, prize pool, charity showcase, draw mechanics, social marquee, CTA, footer.
- Added charity directory and profile pages.

Important files:

```text
src/app/page.tsx
src/components/landing/*
src/components/layout/Navbar.tsx
src/components/layout/Footer.tsx
```

### Phase 10: Email Notifications

What we did:

- Added Resend helper.
- Added React email templates.
- Called draw results and winner alert emails from publish draw API.

Important files:

```text
src/lib/emails/resend.ts
src/lib/emails/templates/*
```

### Phase 11: Polish, QA, Deployment Preparation

What we did:

- Added Playwright tests.
- Added mobile/desktop projects in Playwright config.
- Added loading states and empty states across components.
- Added responsive layouts.
- Added error handling in API routes.

Important files:

```text
e2e/*
playwright.config.ts
src/app/**/loading.tsx
```

---

## 20. Complete User Journey

### 20.1 Public Visitor Journey

```text
Visitor lands on homepage
        |
        v
Reads hero, how it works, charity impact, prize explanation
        |
        v
Clicks subscribe CTA
        |
        v
Chooses monthly/yearly plan
        |
        v
Logs in or signs up
        |
        v
Completes Stripe checkout
        |
        v
Becomes active subscriber
```

### 20.2 Subscriber Journey

```text
Subscriber logs in
        |
        v
Goes to dashboard
        |
        v
Adds latest 5 scores
        |
        v
Chooses charity and percentage
        |
        v
Waits for monthly draw
        |
        v
Views latest draw result
        |
        v
If winner, uploads proof
        |
        v
Admin verifies and marks paid
```

### 20.3 Admin Journey

```text
Admin logs in
        |
        v
Middleware confirms role = admin
        |
        v
Admin opens overview
        |
        v
Reviews users, charities, winners, draws
        |
        v
Runs draw simulation
        |
        v
Publishes draw
        |
        v
Winner records are created
        |
        v
Admin reviews winner proof
        |
        v
Approves/rejects and marks payout
```

---

## 21. Data Flow Diagrams

### 21.1 Signup Data Flow

```text
AuthModal
  |
  v
Supabase Auth signUp
  |
  v
auth.users row created
  |
  v
Database trigger: handle_new_user
  |
  v
public.users profile row created
```

### 21.2 Score Data Flow

```text
ScoreEntry component
  |
  v
POST /api/scores
  |
  v
Validate user + score + date
  |
  v
Insert into scores
  |
  v
Database trigger keeps latest 5
  |
  v
Realtime event / manual refresh
  |
  v
ScoreList and ParticipationSummary update
```

### 21.3 Draw Data Flow

```text
Admin new draw page
  |
  v
/api/draw/simulate
  |
  v
Preview draw numbers and match counts
  |
  v
Admin confirms publish
  |
  v
/api/draw/publish
  |
  v
draws row
  |
  v
draw_entries rows
  |
  v
winners rows for 3+ matches
  |
  v
emails sent
```

### 21.4 Winner Verification Data Flow

```text
User sees winning record
  |
  v
Uploads proof to Supabase Storage
  |
  v
Admin opens winner review page
  |
  v
Admin approves or rejects
  |
  v
winners.verification_status updates
  |
  v
winners.payment_status becomes paid if approved
```

---

## 22. How To Explain The Project In An Interview

### 22.1 Simple Opening Explanation

You can say:

> GolfGive is a full-stack subscription platform that combines golf scoring, charity giving, and monthly prize draws. Users subscribe through Stripe, enter their latest 5 Stableford scores, choose a charity and contribution percentage, and then participate in monthly draws. Admins can manage users, charities, draws, winners, and payouts. The backend uses Supabase for auth, database, RLS security, storage, and realtime updates, while Next.js handles the UI and API routes.

### 22.2 Architecture Explanation

You can say:

> The application uses Next.js App Router as the main framework. Public pages are available to everyone, while dashboard and admin routes are protected using Supabase sessions in middleware. The database is PostgreSQL through Supabase, with RLS policies so users only access their own data. Stripe handles subscriptions, and webhook events update subscription status in Supabase. The draw engine is separated into small modules for random draw, weighted draw, matching, and prize calculation.

### 22.3 Database Explanation

You can say:

> The main tables are users, scores, charities, draws, draw_entries, winners, and subscriptions. Scores are constrained to 1-45 and one per date. A database trigger automatically keeps only the latest 5 scores per user. Draw publishing creates a draw row, snapshots each user's 5 scores into draw_entries, and creates winner rows for users with 3 or more matches.

### 22.4 Security Explanation

You can say:

> Security is handled at multiple levels. Middleware protects dashboard and admin routes. Supabase RLS prevents users from reading or changing other users' rows. Admin actions require the user's role to be admin. Sensitive actions like Stripe webhooks use server-side keys only, and the service role key is never exposed to the browser.

### 22.5 Draw Engine Explanation

You can say:

> The draw engine first groups each user's latest 5 scores. It generates 5 drawn numbers, compares those numbers with every user's score set, counts matches, and then calculates prize tiers. A simulation endpoint previews this without saving. A publish endpoint saves the draw, creates draw entries, records winners, and sends email notifications.

### 22.6 UI Explanation

You can say:

> The UI follows a dark premium design system. Lime is used for primary CTAs and active states, while gold is reserved for prize and jackpot moments. The goal is to lead with emotional charity impact instead of traditional golf imagery.

---

## 23. Current Implementation Status And Honest Talking Points

This section is important. It helps you avoid being caught off guard.

### 23.1 Strongly Implemented

- Next.js app structure.
- Supabase auth integration.
- Middleware route protection.
- Database schema and RLS policies.
- Score CRUD and validation.
- 5-score rolling database trigger.
- Public charity directory and profile.
- Dashboard layout and modules.
- Admin dashboard pages.
- Stripe checkout and webhook route.
- Draw simulation and publish flow.
- Winner records and admin verification pages.
- Email helper and templates.
- Playwright tests.
- Realtime dashboard refresh pattern.

### 23.2 Partially Implemented Or Needs Polish

| Area | Current Status | What To Say |
|---|---|---|
| Algorithmic draw | Library exists, UI mode exists, backend mostly uses random | Needs final wiring from admin selection to API |
| Prize split | Code has multiple split concepts | Needs final alignment with PRD 40/35/25 |
| Subscription UI | `SubscriptionCard` always shows active due to `|| true` | Backend is present; UI condition needs correction |
| Charity admin create | Insert fields do not match schema | Rename to `website` and `image_url` |
| Role toggle | Some UI code uses `user` instead of `subscriber` | Change to enum value `subscriber` |
| Winner proof upload | Uploads file but does not fully save proof URL to winner row | Add update after upload |
| Generated DB types | `database.types.ts` is empty placeholder | Regenerate Supabase types for stronger typing |
| Google auth | Button exists but not implemented | Email/password auth is implemented |

### 23.3 How To Frame These Gaps Positively

You can say:

> The core architecture and flows are in place. Some final production polish remains, mainly wiring the algorithmic draw mode fully, aligning prize percentages exactly with the PRD, and tightening a few schema-name mismatches. These are not architecture blockers because the modules and data model already support the intended behavior.

---

## 24. Important Files To Remember

### Frontend

```text
src/app/page.tsx
src/app/subscribe/page.tsx
src/app/charities/page.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(admin)/admin/page.tsx
```

### Authentication

```text
src/components/auth/AuthModal.tsx
src/contexts/AuthContext.tsx
src/lib/supabase/middleware.ts
src/app/api/auth/callback/route.ts
```

### Dashboard

```text
src/components/dashboard/ScoreEntry.tsx
src/components/dashboard/ScoreList.tsx
src/components/dashboard/CharityModule.tsx
src/components/dashboard/SubscriptionCard.tsx
src/components/dashboard/ParticipationSummary.tsx
src/components/dashboard/WinningsOverview.tsx
src/components/dashboard/LatestResults.tsx
```

### Admin

```text
src/app/(admin)/admin/users/page.tsx
src/app/(admin)/admin/draws/new/page.tsx
src/app/(admin)/admin/charities/page.tsx
src/app/(admin)/admin/winners/page.tsx
```

### Backend APIs

```text
src/app/api/scores/route.ts
src/app/api/scores/[id]/route.ts
src/app/api/stripe/checkout/route.ts
src/app/api/stripe/webhook/route.ts
src/app/api/draw/simulate/route.ts
src/app/api/draw/publish/route.ts
src/app/api/user/charity/route.ts
src/app/api/user/winnings/route.ts
```

### Core Logic

```text
src/lib/draw-engine/random.ts
src/lib/draw-engine/weighted.ts
src/lib/draw-engine/matcher.ts
src/lib/draw-engine/prize.ts
src/lib/emails/resend.ts
```

### Database

```text
supabase/migrations/20260428120000_create_golfgive_core_schema.sql
supabase/migrations/20260428121000_create_golfgive_rls.sql
supabase/migrations/20260429060000_enable_realtime.sql
```

---

## 25. Simple Feature-To-Code Mapping

| Feature | Main Code |
|---|---|
| Landing page | `src/app/page.tsx`, `src/components/landing/*` |
| Auth modal | `src/components/auth/AuthModal.tsx` |
| Auth state | `src/contexts/AuthContext.tsx` |
| Route protection | `src/middleware.ts`, `src/lib/supabase/middleware.ts` |
| Supabase clients | `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts` |
| Subscribe page | `src/app/subscribe/page.tsx` |
| Stripe checkout | `src/app/api/stripe/checkout/route.ts` |
| Stripe webhook | `src/app/api/stripe/webhook/route.ts` |
| Score entry | `src/components/dashboard/ScoreEntry.tsx` |
| Score list | `src/components/dashboard/ScoreList.tsx` |
| Score APIs | `src/app/api/scores/*` |
| Charity directory | `src/app/charities/page.tsx` |
| Charity dashboard | `src/components/dashboard/CharityModule.tsx` |
| Draw simulation | `src/app/api/draw/simulate/route.ts` |
| Draw publishing | `src/app/api/draw/publish/route.ts` |
| Prize calculation | `src/lib/draw-engine/prize.ts` |
| Admin overview | `src/app/(admin)/admin/page.tsx` |
| Admin users | `src/app/(admin)/admin/users/page.tsx` |
| Admin draws | `src/app/(admin)/admin/draws/*` |
| Admin winners | `src/app/(admin)/admin/winners/*` |
| Emails | `src/lib/emails/*` |
| Tests | `e2e/*` |

---

## 26. Final Mental Model

Think of GolfGive as 4 connected systems:

```text
1. Membership System
   Auth + Stripe + subscription status

2. Game System
   Scores + draw engine + matching + prizes

3. Charity System
   Charity directory + user selection + contribution percentage

4. Admin System
   Users + draws + charities + winners + analytics
```

The code connects them like this:

```text
User subscribes
  -> subscription becomes active
  -> user enters scores
  -> user chooses charity
  -> admin runs draw
  -> entries are evaluated
  -> winners are created
  -> winners upload proof
  -> admin verifies payout
```

That is the whole project in one flow.

---

## 27. Short Presentation Script

Use this if you need a quick spoken explanation:

> GolfGive is a full-stack Next.js and Supabase platform for golf-based charity prize draws. The user subscribes through Stripe, enters their latest 5 Stableford scores, and chooses a charity with a minimum 10% contribution. Every month, the admin runs a draw. The system compares each user's 5 scores against the drawn numbers, creates draw entries, calculates winners, and records prize payouts. The user dashboard lets subscribers manage scores, charity selection, subscription status, latest draw results, and winnings. The admin dashboard lets admins manage users, charities, draws, winners, and verification. Supabase handles auth, database, RLS, storage, and realtime updates, while Next.js route handlers provide secure backend APIs.

---

## 28. Recommended Next Fixes Before Final Submission

If you have more time, fix these first:

1. Wire algorithmic draw mode fully into `/api/draw/simulate` and `/api/draw/publish`.
2. Align prize percentages exactly with PRD: 40/35/25.
3. Remove `|| true` from `SubscriptionCard` active status.
4. Update winner proof upload to save `proof_url` into the `winners` table.
5. Fix admin charity create fields from `website_url`/`logo_url` to `website`/`image_url`.
6. Fix role toggle from `user` to `subscriber`.
7. Regenerate Supabase TypeScript database types.
8. Run full Playwright suite with real local Supabase/Stripe test setup.

---

End of guide.
