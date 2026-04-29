# BUILD PLAN
**GolfGive Platform**
*Golf Performance � Charity Giving � Monthly Prize Draws*

| | |
|---|---|
| **Prepared For** | Digital Heroes � Selection Process |
| **Stack** | Next.js 14 � Supabase � Stripe � Tailwind CSS � TypeScript |
| **Deployment** | Vercel (new account) + Supabase (new project) |
| **Version** | 1.0 � April 2026 |
| **Draw Modes** | Random Lottery + Algorithmic Weighted |
| **Payments** | Stripe Test Mode |

## 01 Recommended Tech Stack
The following stack is optimised for the PRD requirements: rapid development, scalable architecture, built-in auth, and Vercel-native deployment.

### Frontend
| | |
|---|---|
| **Framework** | Next.js 14 (App Router) � SSR, file-based routing, API routes |
| **Language** | TypeScript � type safety across full stack |
| **Styling** | Tailwind CSS � utility-first, mobile-first by default |
| **UI Components** | shadcn/ui � accessible, unstyled component primitives |
| **Animations** | Framer Motion � micro-interactions, page transitions |
| **Forms** | React Hook Form + Zod � validation and schema safety |
| **State** | Zustand � lightweight global state (subscription, user) |
| **Icons** | Lucide React � consistent icon set |

### Backend / Database
| | |
|---|---|
| **Database** | Supabase (PostgreSQL) � new project as required by PRD |
| **Auth** | Supabase Auth � JWT-based, built-in session management |
| **Storage** | Supabase Storage � winner proof image uploads |
| **Real-time** | Supabase Realtime � draw result live updates |
| **ORM** | Supabase JS Client (v2) � typed queries |
| **API** | Next.js API Routes � server actions + route handlers |

### Payments & Integrations
| | |
|---|---|
| **Payments** | Stripe � Test Mode, Checkout Sessions, Webhooks |
| **Email** | Resend � transactional email (draw results, winner alerts) |
| **Deployment** | Vercel � new account, environment variables required |
| **Env Secrets** | .env.local + Vercel Environment Variables |

## 02 Project Folder Structure
Recommended Next.js App Router structure for clean separation of concerns:

```text
golfgive/
+-- app/
�   +-- (public)/          # Landing, charities, about
�   +-- (auth)/            # Login, signup pages
�   +-- (dashboard)/       # Subscriber portal
�   +-- (admin)/           # Admin panel � protected route group
�   +-- api/               # API route handlers
�   �   +-- stripe/        # Checkout + webhooks
�   �   +-- draw/          # Draw engine endpoints
�   �   +-- scores/        # Score management
�   +-- layout.tsx         # Root layout
+-- components/
�   +-- ui/                # shadcn primitives
�   +-- landing/           # Homepage sections
�   +-- dashboard/         # Subscriber components
�   +-- admin/             # Admin panel components
+-- lib/
�   +-- supabase/          # Client + server clients
�   +-- stripe/            # Stripe helpers
�   +-- draw-engine/       # Draw logic (random + weighted)
�   +-- email/             # Resend templates
+-- hooks/                 # Custom React hooks
+-- types/                 # Shared TypeScript types
+-- middleware.ts          # Auth guard for protected routes
+-- supabase/
    +-- migrations/        # SQL migration files
```

## 03 Database Schema (Supabase / PostgreSQL)
All tables below must be created via SQL migrations in `/supabase/migrations/`. Row-Level Security (RLS) must be enabled on all tables.

### users (extends Supabase auth.users)
| | |
|---|---|
| **id** | uuid PRIMARY KEY (references auth.users) |
| **full_name** | text NOT NULL |
| **email** | text NOT NULL UNIQUE |
| **subscription_id** | text (Stripe subscription ID) |
| **subscription_status** | enum: active \| inactive \| cancelled \| lapsed |
| **subscription_plan** | enum: monthly \| yearly |
| **charity_id** | uuid REFERENCES charities(id) |
| **charity_percentage** | int DEFAULT 10 (10-100) |
| **created_at** | timestamptz DEFAULT now() |

### scores
| | |
|---|---|
| **id** | uuid PRIMARY KEY |
| **user_id** | uuid REFERENCES users(id) |
| **score** | int CHECK (score >= 1 AND score <= 45) |
| **score_date** | date NOT NULL |
| **created_at** | timestamptz DEFAULT now() |
| **UNIQUE** | (user_id, score_date) � no duplicate dates |
| **NOTE** | Max 5 per user. Trigger auto-deletes oldest when 6th inserted. |

### charities
| | |
|---|---|
| **id** | uuid PRIMARY KEY |
| **name** | text NOT NULL |
| **description** | text |
| **image_url** | text |
| **website** | text |
| **is_featured** | boolean DEFAULT false |
| **is_active** | boolean DEFAULT true |
| **created_at** | timestamptz DEFAULT now() |

### draws
| | |
|---|---|
| **id** | uuid PRIMARY KEY |
| **draw_month** | date (first of month) |
| **draw_mode** | enum: random \| algorithmic |
| **drawn_numbers** | int[] (5 numbers) |
| **status** | enum: scheduled \| simulation \| published |
| **jackpot_rollover** | numeric DEFAULT 0 |
| **prize_pool_total** | numeric |
| **published_at** | timestamptz |
| **created_at** | timestamptz DEFAULT now() |

### draw_entries
| | |
|---|---|
| **id** | uuid PRIMARY KEY |
| **draw_id** | uuid REFERENCES draws(id) |
| **user_id** | uuid REFERENCES users(id) |
| **user_scores** | int[] (snapshot of 5 scores at draw time) |
| **match_count** | int (3, 4, or 5) |
| **is_winner** | boolean DEFAULT false |
| **prize_tier** | enum: three_match \| four_match \| five_match \| null |

### winners
| | |
|---|---|
| **id** | uuid PRIMARY KEY |
| **draw_entry_id** | uuid REFERENCES draw_entries(id) |
| **user_id** | uuid REFERENCES users(id) |
| **prize_amount** | numeric |
| **proof_url** | text (Supabase Storage path) |
| **verification_status** | enum: pending \| approved \| rejected |
| **payment_status** | enum: pending \| paid |
| **verified_by** | uuid (admin user id) |
| **created_at** | timestamptz DEFAULT now() |

### subscriptions (audit log)
| | |
|---|---|
| **id** | uuid PRIMARY KEY |
| **user_id** | uuid REFERENCES users(id) |
| **stripe_subscription_id** | text |
| **stripe_customer_id** | text |
| **plan** | enum: monthly \| yearly |
| **amount** | numeric |
| **status** | text |
| **current_period_end** | timestamptz |
| **created_at** | timestamptz DEFAULT now() |

## 04 Draw Engine Logic
Two modes as required by PRD. Both must be selectable from the Admin panel before each draw.

### Mode A � Random Draw
* Generate 5 unique random numbers from the pool of all scores submitted that month.
* Standard lottery-style � no weighting applied.
* Implementation: Fisher-Yates shuffle on the number pool [1..45].

### Mode B � Algorithmic Weighted Draw
* Analyse frequency of all user scores across the platform for the current month.
* Build a weighted pool: scores appearing more often get higher draw probability.
* Optionally invert weights to favour least-common scores (admin toggle).
* Implementation: weighted random selection using cumulative probability distribution.

### Match Logic
| | |
|---|---|
| **5-Number Match** | User's 5 scores exactly match all 5 drawn numbers (any order) |
| **4-Number Match** | Any 4 of user's 5 scores appear in drawn numbers |
| **3-Number Match** | Any 3 of user's 5 scores appear in drawn numbers |

### Prize Pool Distribution
| | |
|---|---|
| **5-Match (Jackpot)** | 40% of monthly prize pool � rolls over if unclaimed |
| **4-Match** | 35% � split equally among all 4-match winners |
| **3-Match** | 25% � split equally among all 3-match winners |
| **Pool Source** | Fixed % of each subscription fee, auto-calculated on subscriber count |

### Admin Draw Workflow
1. Admin selects draw mode (random or algorithmic)
2. Run Simulation � preview winners without publishing
3. Review simulation results
4. Publish � locks results, notifies winners by email
5. If no 5-match: jackpot rolls to next month automatically

## 05 Subscription & Payment Flow

### Stripe Setup (Test Mode)
* Create two Stripe Products: Monthly Plan and Yearly Plan
* Create Price objects for each, store Price IDs in `.env`
* Use Stripe Checkout Session for payment flow
* Configure Stripe Webhook endpoint: `/api/stripe/webhook`
* Handle events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### Subscription States
| | |
|---|---|
| **active** | Subscription paid and valid � full platform access |
| **inactive** | Never subscribed � restricted access |
| **cancelled** | User cancelled � access until period end, then restricted |
| **lapsed** | Payment failed � grace period then restricted |

### Middleware Protection
* `middleware.ts` intercepts every request to `/(dashboard)` and `/(admin)`
* Checks Supabase session + `subscription_status` on each request
* Redirects unauthenticated users to `/login`
* Redirects inactive/lapsed users to `/subscribe`
* Admin routes check user `role = admin` in users table

## 06 Score Management Rules
* Maximum 5 scores stored per user at all times
* Score range: 1 to 45 (Stableford format) � validated on client AND server
* Each score requires a date � no two scores may share the same date
* When a 6th score is submitted: oldest score is auto-deleted via Supabase trigger
* Scores displayed in reverse chronological order (newest first)
* Users may edit or delete an existing date's score only � no duplicate dates

**Supabase Trigger (auto-delete oldest when count exceeds 5):**
```sql
CREATE OR REPLACE FUNCTION enforce_score_limit()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM scores
  WHERE user_id = NEW.user_id
  AND id NOT IN (
    SELECT id FROM scores
    WHERE user_id = NEW.user_id
    ORDER BY score_date DESC LIMIT 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 07 Charity System
* User selects a charity at signup � stored in `users.charity_id`
* Minimum contribution: 10% of subscription fee (enforced in DB + UI)
* User may voluntarily increase their `charity_percentage` at any time
* Independent donation option available (not tied to gameplay)

### Charity Directory (Public Page)
* Searchable and filterable charity listing
* Individual charity profile: name, description, images, upcoming events (golf days)
* Featured / Spotlight charity section on homepage
* Admin can add / edit / delete charities and mark as featured

## 08 Phased Build Plan
Work through each phase in order. Do not skip phases. Each phase has a clear deliverable to test before moving on.

### Phase 1 � Project Setup & Infrastructure
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Create new Vercel account, new Supabase project | **CRITICAL** | 30 min |
| 2 | Initialise Next.js 14 app with TypeScript + Tailwind | **CRITICAL** | 20 min |
| 3 | Install dependencies: shadcn/ui, Framer Motion, Zustand, Zod, React Hook Form, Stripe SDK, Supabase JS, Resend | **CRITICAL** | 20 min |
| 4 | Configure `.env.local` with all keys (Supabase URL, anon key, Stripe test keys, Resend key) | **CRITICAL** | 20 min |
| 5 | Set up Supabase client (browser + server) in `lib/supabase/` | **CRITICAL** | 30 min |
| 6 | Configure `middleware.ts` for route protection | **CRITICAL** | 45 min |
| 7 | Run all SQL migrations � create all tables with RLS policies | **CRITICAL** | 60 min |
| 8 | Deploy skeleton to Vercel, confirm env vars work in production | **HIGH** | 30 min |

### Phase 2 � Authentication
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Signup page: email, password, full name � creates `auth.users` + users row | **CRITICAL** | 60 min |
| 2 | Login page with Supabase Auth | **CRITICAL** | 30 min |
| 3 | Password reset flow | **HIGH** | 30 min |
| 4 | Auth callback handler (`/api/auth/callback`) | **CRITICAL** | 20 min |
| 5 | Test: signup ? email confirm ? login ? protected route redirect | **CRITICAL** | 30 min |

### Phase 3 � Subscription & Stripe
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Create Stripe products + prices in Stripe Test Dashboard | **CRITICAL** | 20 min |
| 2 | Subscription selection page (monthly vs yearly) | **CRITICAL** | 45 min |
| 3 | POST `/api/stripe/checkout` � creates Stripe Checkout Session | **CRITICAL** | 45 min |
| 4 | Success + Cancel redirect pages | **HIGH** | 20 min |
| 5 | POST `/api/stripe/webhook` � handle all subscription events, update users table | **CRITICAL** | 90 min |
| 6 | Stripe CLI local webhook testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook` | **CRITICAL** | 30 min |
| 7 | Test full subscription lifecycle: subscribe, cancel, lapse | **CRITICAL** | 45 min |

### Phase 4 � Score Management
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Score entry UI � date picker + score input (1-45 validation) | **CRITICAL** | 60 min |
| 2 | POST `/api/scores` � insert with duplicate date check | **CRITICAL** | 45 min |
| 3 | Install Supabase trigger for 5-score rolling limit | **CRITICAL** | 30 min |
| 4 | Score list component (reverse chronological, edit/delete per row) | **HIGH** | 60 min |
| 5 | PATCH `/api/scores/[id]` � update existing score | **HIGH** | 30 min |
| 6 | DELETE `/api/scores/[id]` � delete score | **HIGH** | 20 min |
| 7 | Test all edge cases: duplicate date, out-of-range score, 6th score auto-delete | **CRITICAL** | 45 min |

### Phase 5 Charity System
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Seed charities table with 5-10 sample charities | **HIGH** | 30 min |
| 2 | Public charity directory page with search + filter | **HIGH** | 90 min |
| 3 | Individual charity profile page | **MEDIUM** | 60 min |
| 4 | Charity selection at signup (step 2 after auth) | **CRITICAL** | 45 min |
| 5 | Dashboard: update charity + contribution percentage | **HIGH** | 45 min |

### Phase 6 � Draw Engine
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | `lib/draw-engine/random.ts` � random 5-number draw from score pool | **CRITICAL** | 60 min |
| 2 | `lib/draw-engine/weighted.ts` � frequency analysis + weighted selection | **CRITICAL** | 90 min |
| 3 | `lib/draw-engine/matcher.ts` � match user scores against draw numbers (3/4/5) | **CRITICAL** | 60 min |
| 4 | `lib/draw-engine/prize.ts` � calculate prize pool tiers + split per winner | **CRITICAL** | 60 min |
| 5 | POST `/api/draw/simulate` � run simulation, return preview results (no DB write) | **CRITICAL** | 45 min |
| 6 | POST `/api/draw/publish` � save draw, update `draw_entries`, create winners rows | **CRITICAL** | 60 min |
| 7 | Jackpot rollover logic � if no 5-match, carry 40% to next draw | **HIGH** | 30 min |
| 8 | Unit test draw engine with known input/output | **HIGH** | 60 min |

### Phase 7 � User Dashboard
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Dashboard layout with sidebar navigation | **HIGH** | 60 min |
| 2 | Subscription status card (active/inactive/renewal date) | **CRITICAL** | 45 min |
| 3 | Score entry and edit module (reuse from Phase 4) | **CRITICAL** | 30 min |
| 4 | Charity & contribution percentage module | **HIGH** | 45 min |
| 5 | Participation summary (draws entered, upcoming draw date) | **HIGH** | 60 min |
| 6 | Winnings overview (total won, payment status per win) | **HIGH** | 60 min |
| 7 | Winner proof upload (Supabase Storage) for eligible winners | **HIGH** | 60 min |

### Phase 8 � Admin Panel
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Admin route group with role check middleware | **CRITICAL** | 30 min |
| 2 | User management: list, search, view/edit profile, edit scores, manage subscription | **HIGH** | 120 min |
| 3 | Draw management: select mode, configure, simulate, review, publish | **CRITICAL** | 120 min |
| 4 | Charity management: CRUD, set featured, manage media | **HIGH** | 90 min |
| 5 | Winners management: view list, approve/reject proof, mark as paid | **CRITICAL** | 90 min |
| 6 | Reports & analytics: total users, prize pool total, charity contributions, draw stats | **MEDIUM** | 90 min |

### Phase 9 � Landing Page & Public Pages
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Landing page hero: what you do, how you win, charity impact, CTA | **CRITICAL** | 120 min |
| 2 | Animated sections: draw mechanics explainer, charity spotlight | **HIGH** | 90 min |
| 3 | Subscribe CTA section � prominent, persuasive, motion-enhanced | **CRITICAL** | 60 min |
| 4 | Charity directory public page (from Phase 5) | **HIGH** | 30 min |
| 5 | How it Works page | **MEDIUM** | 60 min |
| 6 | Footer with links, social, charity statement | **MEDIUM** | 30 min |

### Phase 10 � Email Notifications
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Configure Resend account + domain | **HIGH** | 20 min |
| 2 | Email: welcome after signup | **HIGH** | 30 min |
| 3 | Email: subscription confirmed / renewal reminder | **HIGH** | 30 min |
| 4 | Email: draw results published (all participants) | **CRITICAL** | 45 min |
| 5 | Email: winner alert with proof upload instructions | **CRITICAL** | 45 min |
| 6 | Email: payout confirmed | **MEDIUM** | 30 min |

### Phase 11 Polish, QA & Deployment
| # | Task | Priority | Est. Time |
|---|---|---|---|
| 1 | Mobile responsiveness audit across all pages | **CRITICAL** | 90 min |
| 2 | Performance: image optimisation, lazy loading, font subsetting | **HIGH** | 60 min |
| 3 | Error handling: API errors, Stripe failures, empty states | **HIGH** | 60 min |
| 4 | Full testing checklist from PRD (all 11 items) | **CRITICAL** | 120 min |
| 5 | Configure production env vars in Vercel dashboard | **CRITICAL** | 20 min |
| 6 | Deploy to production, smoke test all critical paths | **CRITICAL** | 60 min |
| 7 | Create test credentials: subscriber user + admin user | **CRITICAL** | 15 min |

## 09 Testing Checklist (PRD Required)
Tick each item before submission. All must pass.

- [ ] **User signup & login**: Email confirm ? login ? dashboard redirect
- [ ] **Subscription flow**: Monthly AND yearly � Stripe test cards
- [ ] **Score entry**: 5-score rolling logic, duplicate date rejection, range validation
- [ ] **Draw system**: Random mode + algorithmic mode + simulation + publish
- [ ] **Charity selection**: Select at signup, update from dashboard, contribution %
- [ ] **Winner verification**: Proof upload ? admin approve/reject ? payout mark
- [ ] **User Dashboard**: All 5 modules visible and functional
- [ ] **Admin Panel**: All sections: users, draw, charities, winners, reports
- [ ] **Data accuracy**: Prize pool maths, score limits, charity contributions
- [ ] **Responsive design**: Mobile and desktop for all pages
- [ ] **Error handling**: Invalid inputs, failed payments, duplicate scores

## 10 Required Environment Variables
Add all of these to `.env.local` and mirror them in Vercel project settings.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

## 11 Key Rules & Gotchas
* Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client � server-side only
* Always validate Stripe webhook signatures with `STRIPE_WEBHOOK_SECRET`
* Enable RLS on all Supabase tables � add explicit policies
* Score dates must be unique per user � enforce at DB level (UNIQUE constraint) AND API level
* Admin role: add a role column to users table (enum: `subscriber` | `admin`) � set manually in Supabase for admin accounts
* Draw simulation must NOT write to the database � preview only
* Jackpot rollover: store `jackpot_rollover` in draws table, add to next month's pool automatically
* Charity contribution minimum 10% � validate on server, do not trust client
* All prize pool maths must be server-side � never trust client-submitted amounts
* Use Next.js Server Actions or API Routes for all mutations � no direct Supabase calls from client for sensitive operations

---
*GolfGive Build Plan � Prepared by AI-assisted development � Digital Heroes Selection Process � 2026*
