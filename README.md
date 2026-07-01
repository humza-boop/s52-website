# Handoff: Schema 52 Homepage

## Overview
This is the high-fidelity homepage design for Schema 52 — an AI operations consultancy serving professional services firms (tax, legal, financial services). The design is editorial, minimal, and cinematic in character. The goal was to move away from a "slide deck" aesthetic toward a confident, typographically-led site that feels like a premium annual report.

## About This Repo
`index.html` is the production site — a single static HTML file with inline CSS and vanilla JS, deployed as-is on Vercel. There is no build step. The original design prototypes used during handoff (`.dc.html` files, `support.js`) have been removed now that the design is implemented in `index.html`.

## Fidelity
**High-fidelity.** Colors, typography, spacing, interactions, animations, and copy are all final and should be implemented pixel-accurately.

---

## Page Structure

The page is a single scrolling homepage with 5 sections + footer. No routing required.

```
1. Hero          — full viewport, black, animated mark
2. Mission       — warm ivory, large headline + body + credential logos
3. Industries    — full viewport width, 3 photo panels
4. How We Work   — dark, editorial 4-step process list
5. CTA           — warm ivory, headline + contact form
   Footer        — warm ivory, logo + tagline + copyright
```

---

## Design Tokens

### Colors
| Name | Hex | Usage |
|---|---|---|
| Near-black | `#0A0A0A` | Hero bg, industries bg, process bg |
| Pure black | `#000000` | Hero section only |
| Warm ivory | `#F3F2EF` | Mission bg, CTA bg, footer bg |
| Off-white | `#ECE7DF` | Primary text on dark backgrounds |
| Amber | `#C98A3E` | Accent — step numbers, icons, button border, hover states |

### Typography
- **Font**: Inter (Google Fonts) — weights 300, 400, 500
- **Fallback**: `'Helvetica Neue', sans-serif`
- `-webkit-font-smoothing: antialiased` on body

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Mission headline | `clamp(52px, 7.2vw, 96px)` | 300 | `#0A0A0A` | `letter-spacing: -0.026em`, `line-height: 1.07` |
| Mission body | `clamp(18px, 1.85vw, 26px)` | 300 | `rgba(10,10,10,0.52)` | `line-height: 1.75` |
| Process h3 | `30px` | 300 | `#ECE7DF` | `letter-spacing: -0.015em`, `line-height: 1.18` |
| Process body | `15px` | 300 | `rgba(236,231,223,0.62)` | `line-height: 1.84` |
| Process numeral | `13px` | 300 | `#C98A3E` | `letter-spacing: 0.14em` |
| CTA headline | `clamp(44px, 5.2vw, 72px)` | 300 | `#0A0A0A` | `letter-spacing: -0.022em`, `line-height: 1.07` |
| Nav CTA | `10px` | 400 | `#ECE7DF` | `letter-spacing: 0.13em`, uppercase |
| Industry label | `9px` | 300 | `rgba(236,231,223,0.42)` | `letter-spacing: 0.18em`, uppercase |
| Industry tagline | `13px` | 300 | `rgba(236,231,223,0.88)` | `line-height: 1.6` |
| Credential label | `9px` | 300 | `rgba(10,10,10,0.26)` | `letter-spacing: 0.2em`, uppercase |
| Footer tagline | `9px` | 300 | `rgba(10,10,10,0.34)` | `letter-spacing: 0.24em`, uppercase |
| Footer copyright | `10px` | 300 | `rgba(10,10,10,0.48)` | `letter-spacing: 0.05em` |

### Spacing
- Desktop section padding: `148–160px` top/bottom, `64px` sides
- Max content width: `1280px` (centered), `960px` for process section
- Process step vertical padding: `72px` between steps
- Process step grid: `64px numeral column | 1fr content`, `48px gap`

---

## Section Specifications

### 1. Hero
- **Background**: `#000`
- **Layout**: Full `100vh`, flex center both axes
- **Content**: Schema 52 mark SVG only — no text, no nav visible
- **Mark size**: `height: min(22vh, 175px)`, `viewBox="0 0 243 277"`
- **Mark SVG paths**: See the HTML file for the 3 exact path data strings
- **Warm radial glow**: After mark resolves (~3.6s), fade in a radial gradient: `radial-gradient(ellipse at 50% 58%, rgba(201,138,62,0.065) 0%, transparent 62%)` — opacity transitions from 0→1 over 3.2s ease
- **Scroll indicator**: Centered bottom, `36px` from bottom. "SCROLL" label at `9px`, `letter-spacing: 0.22em`, `rgba(236,231,223,0.22)`. Below it: `1px × 44px` vertical line, with an amber drip animation looping infinitely

### 2. Nav (fixed, persistent)
- **Position**: Fixed top, full width, `z-index: 100`
- **Default state**: Fully transparent, logo and CTA hidden (`opacity: 0`)
- **Scrolled state** (triggers at `scrollY > 60`): `background: rgba(0,0,0,0.96)`, `backdrop-filter: blur(14px)`, bottom border `rgba(236,231,223,0.05)`, logo and CTA fade in
- **Logo**: `schema52-A-dark.svg` at `46px` height
- **CTA button**: "Book a Call" — ghost style, `border: 1px solid rgba(201,138,62,0.38)`, `padding: 11px 24px`, `font-size: 10px`, uppercase
- **CTA hover**: `border-color: rgba(201,138,62,0.7)`, `color: #C98A3E`
- **Transition**: `0.5s ease` on background and border

### 3. Mission
- **Background**: `#F3F2EF`
- **Padding**: `160px 64px 140px`
- **Headline**: "The AI advantage isn't reserved for Silicon Valley." — display size (see tokens), `color: #0A0A0A`
- **Body**: "S52 helps professional services firms redesign operations with AI so their people can spend more time doing the work only they can do." — full width, body size (see tokens)
- **Credential strip**: `margin-top: 52px`, `border-top: 1px solid rgba(10,10,10,0.1)`, `padding-top: 36px`
  - Label: "BUILT BY LEADERS FROM" at `9px` uppercase
  - Logos: Techstars, Shell, Accenture, Bain, Gartner, HEB, AMC — `filter: brightness(0)`, `opacity: 0.28`, `justify-content: space-between`
  - Logo heights: Techstars 22px, Shell 28px, Accenture 20px, Bain 16px, Gartner 16px, HEB 28px, AMC 18px

**Animation**: Word-by-word reveal on scroll into view. Each word wrapped in a `<span>`, starts `opacity: 0, translateY(12px)`, transitions to `opacity: 1, translateY(0)`. Headline words reveal first (58ms stagger), body words follow after headline completes (+160ms offset, 52ms stagger). Easing: `cubic-bezier(0.16,1,0.3,1)`, duration `0.9s`.

### 4. Industries
- **Background**: `#0A0A0A`
- **Layout**: CSS Grid, `grid-template-columns: 1fr 1fr 1fr`, full viewport width (no max-width container), `height: min(80vh, 740px)`
- **Three panels**: Tax & Accounting | Legal | Financial Services
- **Each panel**:
  - Background image (see Assets), `background-size: cover`, `filter: brightness(0.72) saturate(0.7)`
  - Photo element has `inset: -6%` to allow parallax movement without white edges
  - Base vignette: `linear-gradient(to top, rgba(0,0,0,0.64) 0%, transparent 48%)`
  - Hover vignette (additional layer): `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.28) 52%, transparent 72%)` — fades in at `opacity: 0→1` over `0.65s`
  - Tagline: `13px`, `font-weight: 300`, hidden by default (`opacity: 0, translateY(8px)`), slides up on hover
  - Label: always visible at `rgba(236,231,223,0.42)`, transitions to `0.88` on hover
  - Border between panels: `border-left: 1px solid rgba(0,0,0,0.5)`
- **Photo parallax**: On scroll, each photo translates `Y` by `(panelCenterY - viewportCenterY) * 0.028`
- **Photo scale on hover**: `scale(1.03)`, transition `1.1s cubic-bezier(0.4,0,0.2,1)`

**Background positions**:
| Panel | Image | `background-position` |
|---|---|---|
| Tax | `image_tax.png` | `4% center` |
| Legal | `image_legal.png` | `72% 20%` |
| Finance | `image_finance.png` | `center 35%` |

### 5. How We Work
- **Background**: `#0A0A0A`
- **Max-width**: `960px`, centered, `padding: 148px 64px`
- **Layout**: 4 steps, each a CSS Grid with `64px numeral column | 1fr content`, `48px gap`, `72px` vertical padding
- **Dividers between steps**: `1px solid rgba(236,231,223,0.07)`
- **Each step contains**:
  - Amber step number (`01`–`04`) at `13px`, `letter-spacing: 0.14em`, `color: #C98A3E`
  - SVG icon at `28×28px`, amber at `rgba(201,138,62,0.72)`, `stroke-width: 1.2`
  - `h3` title at `30px`, `font-weight: 300`, `color: #ECE7DF`
  - Body paragraph at `15px`, `font-weight: 300`, `color: rgba(236,231,223,0.62)`

**Icons** (thin-stroke, `viewBox="0 0 24 24"`):
| Step | Icon description | Paths |
|---|---|---|
| 01 | Orbit/eye | `<ellipse cx="12" cy="12" rx="10" ry="6">` + `<circle cx="12" cy="12" r="3">` |
| 02 | Target/crosshair | Circle r=8, circle r=2, 4 crosshair lines |
| 03 | Box + arrow | `<rect x="2" y="8" width="13" height="8" rx="1">` + line + polyline |
| 04 | Refresh arc | `<path d="M8,4 A8,8 0 1,0 20,12">` + `<polyline points="16,8 20,12 16,16">` |

**Animation per step** (triggered individually by IntersectionObserver at `threshold: 0.18`):
- Step slides in: `opacity: 0→1`, `translateY(20px→0)`, `0.9s cubic-bezier(0.16,1,0.3,1)`
- Icon paths draw: `stroke-dashoffset: 120→0`, `1.4s cubic-bezier(0.4,0,0.2,1)`, starting `400ms` after step appears, `160ms` stagger between paths

### 6. CTA
- **Background**: `#F3F2EF`
- **Border-top**: `1px solid rgba(10,10,10,0.07)`
- **Padding**: `140px 64px 120px`
- **Layout**: Flex row, `justify-content: space-between`, `align-items: flex-start`, `gap: 80px`
- **Left**: Headline — `flex: 1`, `min-width: 280px`, `color: #0A0A0A`
- **Right**: Form — `flex: 0 0 420px`, `min-width: 280px`
- **Form fields**: Name + Work email (grid 1fr 1fr), Company (full width), Message textarea (3 rows)
  - `background: rgba(10,10,10,0.03)`, `border: 1px solid rgba(10,10,10,0.22)`
  - `color: #0A0A0A`, placeholder `rgba(10,10,10,0.32)`
  - Focus: `border-color: rgba(201,138,62,0.55)`
  - Focus amber underline: `1px` amber line draws across bottom of field on focus (`width: 0→100%`, `0.3s`)
- **Button**: Ghost style — `background: transparent`, `color: #0A0A0A`, `border: 1px solid rgba(201,138,62,0.68)`, `padding: 16px 32px`, `font-size: 10px`, `letter-spacing: 0.16em`, uppercase
  - Hover: fills `background: #C98A3E`, `color: #0A0A0A`, `border-color: #C98A3E`

**Animation**: CTA headline does the same word-by-word reveal as Mission (60ms stagger, triggers at `threshold: 0.1`).

### 7. Footer
- **Background**: `#F3F2EF`
- **Border-top**: `1px solid rgba(10,10,10,0.13)`
- **Padding**: `40px 64px`
- **Layout**: Flex row, `justify-content: space-between`, `align-items: center`, `gap: 32px`
- **Logo**: `schema52-A-light.svg` at `36px` height, `opacity: 0.58`
- **Tagline**: "FOR THOSE WHO ADAPT" — `9px`, uppercase, `letter-spacing: 0.24em`, `color: rgba(10,10,10,0.34)`, centered
- **Copyright**: "© 2026 SCHEMA 52" — `10px`, `color: rgba(10,10,10,0.48)`

---

## Interactions & Animations Summary

| Element | Trigger | Animation |
|---|---|---|
| Hero mark | Page load | Stroke-dashoffset trace, ~3s, then fill fades in over 1.8s |
| Hero warm glow | 3.6s after load | Radial amber gradient fades in over 3.2s |
| Scroll hint | 7.5s after load | Drip loop infinite |
| Nav | `scrollY > 60` | Background, border, logo, CTA fade in over 0.5–0.7s |
| Mission headline | Scroll into view | Word-by-word reveal, 58ms stagger |
| Industry panels | Hover | Vignette deepens, tagline slides up, photo scales 1.03 |
| Industry photos | Scroll | Parallax Y translation (0.028 factor) |
| Process steps | Individual scroll into view | Fade + translate up, then icon stroke draws |
| CTA headline | Scroll into view | Word-by-word reveal, 60ms stagger |
| Form fields | Focus | Amber underline draws across bottom |
| Nav CTA button | Hover | Border and text color shift to amber |
| Book a Call button | Hover | Fills amber, text stays dark |

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `≤960px` | Mission/CTA padding to `40px` sides, headline sizes scale down |
| `≤768px` | Nav padding `24px`, all section padding `28px` sides, industry panels stack vertically (`56vw` each), process step numeral column narrows to `40px`, CTA form goes single column, footer padding `28px` |

---

## Assets

| File | Usage |
|---|---|
| `logos/schema52-A-dark.svg` | Nav logo (light text, for dark backgrounds) |
| `logos/schema52-A-light.svg` | Footer logo (dark text, for light backgrounds) |
| `logos/schema52-mark-dark.svg` | Standalone mark reference |
| `logos/techstars.png` | Credential logo |
| `logos/shell.png` | Credential logo |
| `logos/accenture.png` | Credential logo |
| `logos/bain.png` | Credential logo |
| `logos/gartner.png` | Credential logo |
| `logos/heb.webp` | Credential logo |
| `logos/amc.png` | Credential logo |
| `images/image_tax.png` | Tax & Accounting industry panel photo |
| `images/image_legal.png` | Legal industry panel photo |
| `images/image_finance.png` | Financial Services industry panel photo |

All credential logos should be rendered with `filter: brightness(0)` (on light bg) or `filter: brightness(0) invert(1)` (on dark bg) at `opacity: 0.28`.

---

## Notes for Implementation

1. **The mark SVG animation** is the hero interaction. The paths use `stroke-dasharray`/`stroke-dashoffset` to create a trace effect. The exact path data is in the HTML file. Preserve it precisely.

2. **Industry section is intentionally full-bleed** — no `max-width` container. The grid should span `100vw`.

3. **Word-split animation**: In production, split headline text into individual word `<span>` elements at render time, then use IntersectionObserver to trigger the reveal class. Handle `<br>` tags carefully during the split.

4. **Icon stroke-draw**: Each SVG path needs `stroke-dasharray: 120` and `stroke-dashoffset: 120` initially. On step entry, transition `stroke-dashoffset` to `0`. The value `120` is approximate — for production, calculate actual path lengths using `path.getTotalLength()`.

5. **Scroll hint**: Appears only on the hero, hides on scroll (`scrollY > 60`). The amber drip is a `div` inside an `overflow: hidden` container, animated with `translateY(-110% → 210%)` on a 2s loop.

6. **Remove the "← Previous" exploration nav button** in the bottom-right corner — this is a prototype navigation aid only.

7. **Form submission**: see [Contact Form Setup](#contact-form-setup) below.

---

## Contact Form Setup

The contact form (`#rform` in `index.html`) submits to a Google Apps Script Web App, which appends each submission to a Google Sheet and emails `humza@schema52.com` and `kim@schema52.com`. No paid services, API keys, or environment variables are required.

1. Create a new Google Sheet. Add a tab named `Submissions` (or let the script create it automatically on first run).
2. In the Sheet, go to **Extensions → Apps Script**, delete the default boilerplate, and paste in the contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. Click **Deploy → New deployment**, choose type **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then deploy.
4. Copy the resulting `/exec` URL and paste it into the `FORM_ENDPOINT` constant near the bottom of `index.html` (inside the `FORM SUBMIT` script section).
5. Submit a test entry through the live site to confirm a row appears in the Sheet and both recipients receive the email notification.

If the recipient list or sheet name ever needs to change, edit the `NOTIFY_TO` / `SHEET_NAME` constants at the top of `Code.gs` and redeploy (**Deploy → Manage deployments → Edit → New version**).
