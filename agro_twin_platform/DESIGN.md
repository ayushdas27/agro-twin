---
name: Agro-Twin Platform
colors:
  surface: '#f7faf6'
  surface-dim: '#d8dbd7'
  surface-bright: '#f7faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f1'
  surface-container: '#ecefeb'
  surface-container-high: '#e6e9e5'
  surface-container-highest: '#e0e3e0'
  on-surface: '#181c1a'
  on-surface-variant: '#424844'
  inverse-surface: '#2d312f'
  inverse-on-surface: '#eef1ee'
  outline: '#727974'
  outline-variant: '#c1c8c3'
  surface-tint: '#486458'
  primary: '#07241a'
  on-primary: '#ffffff'
  primary-container: '#1e3a2f'
  on-primary-container: '#86a496'
  inverse-primary: '#aecebe'
  secondary: '#446651'
  on-secondary: '#ffffff'
  secondary-container: '#c6ecd1'
  on-secondary-container: '#4a6c57'
  tertiary: '#002238'
  on-tertiary: '#ffffff'
  tertiary-container: '#003858'
  on-tertiary-container: '#43a5ea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#caeada'
  primary-fixed-dim: '#aecebe'
  on-primary-fixed: '#032017'
  on-primary-fixed-variant: '#304c41'
  secondary-fixed: '#c6ecd1'
  secondary-fixed-dim: '#aacfb6'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#2c4e3a'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f7faf6'
  on-background: '#181c1a'
  surface-variant: '#e0e3e0'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an agricultural intelligence interface built for operational precision, scientific clarity, and field-tested reliability. It rejects techno-futuristic tropes—such as neon glows, heavy glassmorphic blurs, and decorative 3D assets—in favor of an earthy, pragmatic aesthetic modeled after mission-critical GIS mapping tools and enterprise agronomic workstations. 

The tone evokes the quiet confidence of land stewardship combined with computational rigor. The UI provides low-cognitive-load workflows for agronomists, farm managers, and climate researchers operating under direct sunlight on rugged tablets or reviewing seasonal field yields on desktop workstations. Visual hierarchy relies on structured tabular density, high-contrast structural borders, and purposeful nature-grounded tones rather than visual ornamentation.

## Colors

The palette draws directly from balanced field realities: deep forest greens, soft mineral soils, and natural vegetative tones paired with high-contrast text.

- **Primary (`#1E3A2F`)**: Represents foundational actions, primary navigation targets, and confirmation triggers. Hover transitions shift deeper to `#142B21`.
- **Secondary (`#4E705B`)**: Used for analytical filters, crop indices (NDVI indicators), and supporting contextual actions. Supported by `#6B8F77` for hover states and `#EBF1EC` for soft container fills.
- **Tertiary (`#0284C7`)**: Dedicated strictly to hydrological attributes, precipitation overlays, irrigation cycles, and moisture models. Pair with `#E0F2FE` for warning-free hydraulic states.
- **Neutral Dark (`#1B1F1D`)**: High-legibility base for typography. Secondary body text uses `#4A5550`; muted metadata and units of measurement use `#738079`.
- **Surfaces**: Canvas renders on warm porcelain (`#FBFBF9`), card surfaces rest on solid white (`#FFFFFF`), and nested panels/toolbars use `#F3F4F1`.
- **Borders & Dividers**: Structured grids and card bounds require `#E2E6E2` (outer frames) and `#E8EBE7` (hairline data separators).
- **Functional Semantics**:
  - Positive/Sustained: `#16A34A` text on `#DCFCE7` background.
  - Warning/Stress: `#D97706` text on `#FEF3C7` background.
  - Critical/Deficit: `#DC2626` text on `#FEE2E2` background.

## Typography

Typography prioritizes tabular clarity and high scan speeds across dense monitoring readouts. Geist provides geometric neutrality with monospace-like numeric spacing characteristics, preventing layout jitter during real-time telemetry streaming (soil moisture, sensor inputs, weather forecasts).

- **Headlines**: Set tightly with negative letter-spacing for dense spatial layouts. Used for field zone designations, yield summaries, and view headers.
- **Body**: Uses regular weight at 14px (`body-md`) as the platform workhorse for descriptions, field notes, and parameter settings.
- **Labels & Metrics**: Uses medium and semibold weights (`label-md`, `label-sm`) with uppercase transformation for technical categorizations (e.g., pH, NDVI, CEC, NPK ratios). Tabular figures (`tnum`) must be enforced across all quantitative values.

## Layout & Spacing

The layout utilizes a structured 12-column responsive fluid grid designed to accommodate split-screen map workspaces alongside persistent telemetry panels.

- **Desktop (1280px+)**: Multi-pane orientation. Sidebar navigation (fixed 240px), map/GIS canvas (flexible span 7–9), and analytics inspection tray (span 3–5). Gutters: `1.5rem` (`gutter-lg`), Section Margins: `2rem` (`margin-lg`).
- **Tablet (768px - 1279px)**: Collapsible slide-over drawer for telemetry panels. The primary map remains interactive. Gutters: `1rem` (`gutter`), Section Margins: `1.5rem`.
- **Mobile (< 768px)**: Single-column stacked mode with a bottom-sheet interface for GIS point-of-interest inspection. Outer margins: `1rem` (`margin`).

Component spacing relies on an uncompromising 4px base scale:
- `space-xs` (4px): Dense table cell vertical padding, chip internal gaps.
- `space-sm` (8px): Control spacing between icon and text, list item gaps.
- `space-md` (16px): Standard form element gap, card internal padding for dense views.
- `space-lg` (24px): Standard card container padding, section vertical separations.
- `space-xl` (32px): Dashboard block stacking distances.

## Elevation & Depth

Visual hierarchy uses low-contrast physical tiers rather than dramatic drop shadows. All surfaces remain completely opaque to ensure field readability under varying ambient lighting conditions.

- **Level 0 (Canvas Base)**: `#FBFBF9`. The canvas holds base GIS maps, global background containers, and application navigation bars.
- **Level 1 (Card & Operational Surfaces)**: `#FFFFFF` bounded by a 1px solid border (`#E2E6E2`). Grounded by an ultra-subtle contact shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.04)`.
- **Level 2 (Dropdowns, Flyouts, Popovers)**: `#FFFFFF` surrounded by a 1px border (`#E2E6E2`) with an ambient separation shadow: `0 4px 12px 0 rgba(27, 31, 29, 0.08)`.
- **Level 3 (Modal Overlays & System Alerts)**: `#FFFFFF` elevated with `0 12px 24px -4px rgba(27, 31, 29, 0.12)`, anchored with a backdrop overlay of `#1B1F1D` at 40% opacity.

## Shapes

The design system utilizes compact, understated corner radii (`roundedness: 1`, 4px base, up to 6–8px for large containers). This reinforces the functional, instrumentation-grade feel of professional equipment consoles and spatial enterprise tools. Full pill shapes are restricted exclusively to quantitative status tags and micro chips to distinguish metadata from clickable rectangular buttons.

## Components

### Buttons
- **Primary**: Solid background `#1E3A2F`, text `#FFFFFF`, border-radius 6px, height 36px (compact) or 40px (default). Hover: `#142B21`. Active: `#0D1C16`. Focus: 2px offset ring in `#4E705B`.
- **Secondary / Outlined**: Background `#FFFFFF`, 1px border `#E2E6E2`, text `#1B1F1D`. Hover: `#F3F4F1` with border `#D5DBD5`.
- **Tertiary / Ghost**: No border, background transparent, text `#4A5550`. Hover: `#F3F4F1`, text `#1B1F1D`.

### Cards & Panels
Constructed with a `#FFFFFF` fill, 6px border-radius, 1px border `#E2E6E2`, and padding `space-md` or `space-lg`. Card headers feature structured bottom dividers (`1px solid #E8EBE7`) separating title metrics from actionable content.

### Status Chips & Badges
Compact inline indicators using 11px uppercase typography (`label-sm`).
- **Optimal / Normal**: Text `#16A34A`, background `#DCFCE7`, 1px border `#BBF7D0`.
- **Hydration / Moisture**: Text `#0284C7`, background `#E0F2FE`, 1px border `#BAE6FD`.
- **Stress / Attention**: Text `#D97706`, background `#FEF3C7`, 1px border `#FDE68A`.
- **Deficit / Alert**: Text `#DC2626`, background `#FEE2E2`, 1px border `#FECACA`.

### Input Fields & Controls
- **Inputs**: Solid `#FFFFFF` fill, 1px border `#E2E6E2`, text `#1B1F1D`, placeholder `#738079`, radius 6px. Height: 38px. Active focus: 1px border `#1E3A2F` with a soft box-shadow `0 0 0 1px #1E3A2F`.
- **Checkboxes & Radios**: 16px size. Unchecked: 1px border `#738079`, `#FFFFFF` fill. Checked: `#1E3A2F` fill with crisp white icon check/dot. Radius 4px for checkboxes, 50% for radios.

### Data Tables
Engineered for tabular data density:
- Table header row: `#F3F4F1` surface, text `#4A5550`, height 36px, `label-md` uppercase, 1px bottom border `#E2E6E2`.
- Table body rows: Height 44px, alternating hover state `#FBFBF9`, 1px hairline border `#E8EBE7`.
- Alignment: Text left-aligned; numerical data right-aligned with monospace figures.

### Data Progress Bars & Comparison Rows
Avoids decorative circular dials. Progress tracks use an 8px tall track with `#E8EBE7` fill, 4px border-radius, and a solid semantic fill (`#1E3A2F`, `#0284C7`, or `#D97706`). Comparative bounds show dual target tick marks directly overlaid on the horizontal track.