# Feature: Phase 5 – Core Header & Filters System Migration (Post-Taillour)

## Phase 5 objectives

### [x] Step: Extract working B2B header logic into core sections
Create a new core header system composed of `sections/site-header.liquid`.
Replaces Taillour `header.liquid` + `b2b-header.liquid`.
Must support editor-configurable sub-areas:
- Top Bar (Enable/disable, Rotating offer banner, Phone number toggle, Currency selector toggle, Background color setting)
- Middle Bar (Logo, Search, Cart icon, Account icon, Hamburger icon)
- Main Nav Bar (Toggle on/off, Shopify menu selector, Top-level links only)

### [x] Step: Correct Header Filters Integration (Phase 5.1)
Relocate the existing product grid filter system into `sections/site-header-filters.liquid`.
**CRITICAL CORRECTION**:
- Filters are **NOT B2B-specific**.
- Remove all customer-based gating.
- Filters must render for **all users**.
- Filters must behave exactly as before (same schema, markup, JS).
- Only acceptable gating is design mode or page context (if original had it).
- Ensure `header-group.json` includes the new section.

### [x] Step: Define a Taillour deletion / quarantine plan
Identify Taillour-owned sections/snippets that are being replaced.
Stop rendering them in templates/layouts.
Leave files intact but unused.
Expected Taillour replacements include: `header.liquid`, `b2b-header.liquid`, `b2b-header-filters.liquid`.

### [x] Step: Design the mobile menu system (structure only)
Deliverables:
- Mobile menu container
- Triggered by hamburger icon
- Menu source configurable via theme editor
- Markup only, minimal JS
- No animation or mega menu logic yet
