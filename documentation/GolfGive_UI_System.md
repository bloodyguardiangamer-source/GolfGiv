# GolfGive — UI Design System v1.0
> Paste this file as context when prompting any LLM or OpenBuilder to generate UI for GolfGive.

---

## 01. Brand Identity

**Product name:** GolfGive  
**Tagline:** Play. Give. Win.  
**Tone:** Premium, emotionally-driven, modern. NOT a traditional golf site. Lead with charity impact, not sport.  
**Aesthetic direction:** Dark luxury + electric accent. Think high-end fintech meets charity campaign — not fairways and plaid.

---

## 02. Color Palette

### Brand Primaries

| Token | Hex | Usage |
|---|---|---|
| `--color-void` | `#0a0a14` | Page background (deepest dark) |
| `--color-surface` | `#111120` | Cards, panels, modals |
| `--color-surface-alt` | `#1c1c30` | Hover states, elevated surfaces |
| `--color-lime` | `#b8f55a` | Primary CTA, accent, active states |
| `--color-lime-deep` | `#8bdd2a` | CTA hover / pressed |
| `--color-white` | `#ffffff` | Primary headings, display text |
| `--color-muted` | `#9595b5` | Body text, secondary labels |
| `--color-border` | `#2c2c48` | All borders, dividers |

### Semantic / State Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-gold` | `#f5c842` | Jackpot, prize pool, 5-match winner |
| `--color-coral` | `#ff6b4a` | Error, danger, lapsed subscription |
| `--color-blue` | `#5ba3ff` | Info, links, informational states |
| `--color-success` | `#b8f55a` | Same as lime — success, active status |

### Rules
- Background is ALWAYS dark (`#0a0a14` or `#111120`). No light mode.
- The lime green (`#b8f55a`) is the ONLY bright accent. Use it sparingly and with intent.
- Gold (`#f5c842`) is reserved exclusively for prize/jackpot moments. Do not use decoratively.
- Never use generic purple gradients, white backgrounds, or light themes.
- Text on `--color-lime` background must be `#0a0a14` (dark), never white.

---

## 03. Typography

### Font Stack

| Role | Font | Source |
|---|---|---|
| Display / Hero | Playfair Display | Google Fonts |
| Body / UI | DM Sans | Google Fonts |
| Monospace | JetBrains Mono | Google Fonts (code only) |

### Type Scale

| Name | Size | Weight | Line Height | Tracking | Color |
|---|---|---|---|---|---|
| Display | 72–96px | 700 | 1.05 | -2px | `#ffffff` |
| H1 | 48px | 700 | 1.1 | -0.5px | `#ffffff` |
| H2 | 32px | 600 | 1.2 | -0.3px | `#ffffff` |
| H3 | 20px | 600 | 1.3 | 0 | `#ffffff` |
| Body | 16px | 400 | 1.75 | 0 | `#9595b5` |
| Label/Caption | 12px | 500 | 1.4 | 0.08em | `#9595b5` |
| Stat Number | 52–80px | 700 | 1.0 | -2px | `#b8f55a` or `#f5c842` |

### Rules
- Hero headlines use Playfair Display with optional italic on the accent word
- Labels and captions are UPPERCASE with `letter-spacing: 0.08em`
- Stat numbers (prize pool, player count) use the largest weight possible — these are hero moments
- Never use Inter, Roboto, Arial, or system fonts

---

## 04. Spacing System

**Base unit: 4px**  
All spacing is multiples of 4.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Micro gaps |
| `--space-2` | 8px | Component internal padding |
| `--space-3` | 12px | Small gaps |
| `--space-4` | 16px | Default padding |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section sub-gaps |
| `--space-10` | 40px | Component margins |
| `--space-12` | 48px | Large component spacing |
| `--space-16` | 64px | Section spacing (mobile) |
| `--space-20` | 80px | Section spacing (tablet) |
| `--space-30` | 120px | Section spacing (desktop) |

**Container:** max-width `1280px`, centered, `24px` padding each side on mobile.

---

## 05. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Tags, badges, chips |
| `--radius-md` | 8px | Inputs, buttons |
| `--radius-lg` | 12px | Cards, modals, panels |
| `--radius-xl` | 20px | Hero sections, large blocks |
| `--radius-pill` | 999px | Status pills, avatars |

---

## 06. Component Specifications

### Primary CTA Button
```
background: #b8f55a
color: #0a0a14
padding: 12px 28px
border-radius: 8px
font-weight: 700
font-size: 14px
letter-spacing: 0.02em
hover: background #8bdd2a, scale(1.02)
transition: 150ms cubic-bezier(0.16,1,0.3,1)
```

### Secondary Button (outline)
```
background: transparent
border: 1px solid #2c2c48
color: #ffffff
padding: 12px 28px
border-radius: 8px
hover: border-color #b8f55a, color #b8f55a
```

### Ghost Button (lime outline)
```
background: transparent
border: 1px solid #b8f55a
color: #b8f55a
padding: 12px 28px
border-radius: 8px
hover: background #b8f55a15
```

### Status Badge / Pill
```
ACTIVE:  background #b8f55a20, color #b8f55a, font-size 11px, font-weight 600, padding 3px 10px, border-radius 999px, letter-spacing .06em
JACKPOT: background #f5c84220, color #f5c842
LAPSED:  background #ff6b4a20, color #ff6b4a
PENDING: background #9595b520, color #9595b5
FEATURED: background #b8f55a20, color #b8f55a, border-radius 4px
```

### Card (standard)
```
background: #111120
border: 0.5px solid #2c2c48
border-radius: 12px
padding: 20px 24px
```

### Card (jackpot / highlighted)
```
Same as standard card but:
border: 0.5px solid #f5c84240
```

### Input Field
```
background: #1c1c30
border: 0.5px solid #2c2c48
border-radius: 8px
padding: 10px 12px
color: #ffffff
font-size: 13px
placeholder-color: #9595b5
focus: border-color #b8f55a, outline none
```

### Score Display Row
```
Container: background #1c1c30, border-radius 6px, padding 8px 10px
Layout: flex, justify space-between, align center
Date: font-size 13px, color #9595b5
Score number: font-size 20px, font-weight 700, color #b8f55a (latest) or #ffffff (older)
```

### Charity Card
```
Card with image/icon header area (height 100px, background gradient #1c1c30→#2c2c48)
Charity name: 15px, weight 600, color #fff
Description: 12px, color #9595b5, line-height 1.6
Contribution bar: thin 4px track (#2c2c48), filled with #b8f55a
Contribution %: 14px, weight 700, color #b8f55a
```

### Subscription Status Card
```
Header row: label (12px, uppercase, muted) + status badge (right-aligned pill)
Plan name: 16px, weight 600, color #fff
Renewal date: 12px, color #9595b5
```

### Progress / Contribution Bar
```
track: height 4px, background #2c2c48, border-radius 2px
fill: background #b8f55a, border-radius 2px
```

### Section Label (above headings)
```
font-size: 11px
font-weight: 500
letter-spacing: 0.12em
text-transform: uppercase
color: #9595b5
margin-bottom: 16px
```

### Stat / Hero Number Block
```
Number: font-size 52px, font-weight 700, color #b8f55a (or #f5c842 for prize), letter-spacing -2px, line-height 1
Label: font-size 11px, color #9595b5, letter-spacing .08em, text-transform uppercase, margin-top 4px
```

---

## 07. Motion & Animation

### Easing Curves
| Token | Value | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, element reveals |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transitions, state changes |
| `--ease-spring` | GSAP `elastic.out(1, 0.5)` | Playful bounces, CTA hover |

### Duration Scale
| Token | Value | Usage |
|---|---|---|
| `--dur-fast` | 150ms | Hover states, tooltips, button feedback |
| `--dur-base` | 300ms | Panel open/close, tab switch |
| `--dur-slow` | 600ms | Page-level transitions (Barba.js) |
| `--dur-hero` | 1200ms | Hero section staggered entrance |

### GSAP Patterns
```
Hero headline: SplitText by chars, stagger 0.03s, y: 60→0, opacity 0→1, ease: power4.out
Section reveal: ScrollTrigger, start: "top 80%", y: 40→0, opacity 0→1, duration 0.8s
Stat counter: gsap.to(obj, { val: targetNum, duration: 2, ease: "power2.out", onUpdate: render })
Pinned scroll: ScrollTrigger.pin() for horizontal scroll sections (charity showcase)
Parallax: ScrollTrigger scrub: 1, y shift ±30px on background elements
```

### Lenis Config
```js
const lenis = new Lenis({
  lerp: 0.08,
  smoothTouch: false,
  syncTouch: false,
})
// Connect to GSAP ticker:
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

### Barba.js Page Transitions
```
Leave: opacity 1→0, y 0→-20px, duration 300ms ease-in
Enter: opacity 0→1, y 20→0px, duration 500ms ease-out
Hook: beforeLeave → kill all ScrollTriggers, destroy Lenis, reinit on afterEnter
```

### Framer Motion (React dashboard)
```
Page wrapper: initial opacity 0, animate opacity 1, exit opacity 0, transition duration 0.3
Card entrance: initial y:20 opacity:0, animate y:0 opacity:1, transition staggerChildren 0.05
Modal: initial scale:0.95 opacity:0, animate scale:1 opacity:1
```

---

## 08. Page-Specific UI Notes

### Landing / Homepage
- Full-screen dark hero, headline in Playfair Display, subtitle in DM Sans muted
- 3 stat blocks (Prize Pool / Players / Charities) in lime/gold/white numbers
- Charity spotlight section: horizontal scroll with Lenis + GSAP pinning
- "How it works" section: 3-step numbered flow, large numbers in background
- CTA section: single large subscribe button, full-bleed dark block
- NO golf course imagery, NO club/ball imagery as primary design language

### User Dashboard
- Sidebar navigation (dark surface), active item gets lime left-border accent
- Cards use `--color-surface` (#111120), never white
- Score entry module: prominent, top of dashboard
- Subscription status: first card in the grid, with clear status badge

### Admin Panel
- Same dark theme, but add a top warning bar in gold (#f5c842) to signal admin context
- Data tables: zebra rows with #111120 / #1c1c30 alternating, no harsh borders
- Draw configuration: 2-column layout — settings left, simulation preview right

---

## 09. Inspiration References (Awwwards Level)

| Site | Award | Why Relevant |
|---|---|---|
| **Champions For Good** | SOTD Apr 7, 2026 | Sports + charity platform, animated, bold. Closest reference. |
| **Made With GSAP** | SOTD Apr 1, 2025 | Premium GSAP effect patterns and quality bar |
| **FC Porto Memorial** | SOTD + Dev Award Mar 2026 | Dark premium sports scrolltelling aesthetic |
| **Aramco — Shoot For The Future** | SOTD Feb 2026 | Emotional charity impact with immersive visuals |

**URL:** https://www.awwwards.com/websites/sports/ — filter by recent for ongoing reference.

---

## 10. Do / Do Not

### DO
- Use `#0a0a14` as the base for every page and section
- Use lime `#b8f55a` as the ONLY bright CTA color
- Use Playfair Display italic for emotional hero moments
- Use large uppercase labels (`letter-spacing: 0.12em`) above all section headings
- Make prize/jackpot moments gold and oversized — these are emotional peaks
- Use subtle noise texture on the void background (5% opacity SVG filter)
- Animate charity contribution numbers counting up on scroll

### DO NOT
- Do not use white or light backgrounds anywhere
- Do not use generic golf imagery (clubs, fairways, plaid)
- Do not use Inter, Roboto, or Arial
- Do not use purple gradients or generic SaaS palettes
- Do not use more than 2 accent colors on a single screen
- Do not use shadows — use surface layering (#111120 over #0a0a14) instead
- Do not use colored borders except lime (CTA focus) and gold (jackpot cards)

---

## 11. CSS Variables Quick Reference (copy into project)

```css
:root {
  /* Brand */
  --color-void: #0a0a14;
  --color-surface: #111120;
  --color-surface-alt: #1c1c30;
  --color-lime: #b8f55a;
  --color-lime-deep: #8bdd2a;
  --color-white: #ffffff;
  --color-muted: #9595b5;
  --color-border: #2c2c48;

  /* Semantic */
  --color-gold: #f5c842;
  --color-coral: #ff6b4a;
  --color-blue: #5ba3ff;

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-pill: 999px;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast: 150ms;
  --dur-base: 300ms;
  --dur-slow: 600ms;
}
```

---

*GolfGive UI System · Digital Heroes Selection · v1.0 · April 2026*
