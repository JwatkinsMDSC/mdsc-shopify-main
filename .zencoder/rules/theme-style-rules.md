---
description: Shopify Theme Style Rules
alwaysApply: true
---

## 1. CSS OWNERSHIP RULE (NON-NEGOTIABLE)

### ❌ DO NOT inline static styles in `{% style %}` or `<style>` blocks

Static styles include:

* Layout styles
* Spacing
* Typography
* Height / width classes
* Utility classes
* Variant classes like `.full-vh`, `.half-vh`, etc.

If a style:

* Does not depend on a section setting
* Does not change per section instance

👉 **It MUST live in an asset CSS file** (e.g. `hero.css`).

---

### ✅ Inline styles are allowed ONLY for dynamic values

Inline `{% style %}` blocks may be used **only** when:

* The value comes from `section.settings`
* The value varies per section instance
* The value cannot be predetermined at build time

Examples of acceptable dynamic values:

* Colors
* Opacity
* Blend modes
* Per-section spacing overrides
* Per-section image or overlay values

---

## 2. CSS VARIABLES ARE PREFERRED OVER GENERATED CLASSES

### ❌ Avoid generating section-specific class names like:

```css
.hero-overlay-{{ section.id }}
.btn-hero-{{ section.id }}
```

This causes:

* CSS bloat
* Hard-to-trace styles
* Poor maintainability

---

### ✅ Preferred Pattern: CSS Variables

#### In section file (dynamic values only):

```liquid
{% style %}
  #section-{{ section.id }} {
    --hero-overlay-color: {{ section.settings.overlay_color }};
    --hero-overlay-opacity: {{ section.settings.overlay_opacity | divided_by: 100.0 }};
    --hero-overlay-blend: {{ section.settings.overlay_blend_mode }};
    --hero-button-bg: {{ section.settings.button_bg_color }};
    --hero-button-text: {{ section.settings.button_text_color }};
  }
{% endstyle %}
```

#### In asset CSS file (static styles only):

```css
.hero-banner-overlay {
  background-color: var(--hero-overlay-color);
  opacity: var(--hero-overlay-opacity);
  mix-blend-mode: var(--hero-overlay-blend);
}

.btn-hero {
  background-color: var(--hero-button-bg);
  color: var(--hero-button-text);
}
```

---

## 3. SECTION = STRUCTURE, ASSETS = STYLE

### Sections (`sections/*.liquid`) are responsible for:

* Markup
* Data attributes
* Settings wiring
* Conditional rendering
* Exposing CSS variables

### Assets (`assets/*.css`) are responsible for:

* All layout
* All sizing
* All responsive behavior
* All reusable styles
* All variant classes

Never duplicate styles across both.

---

## 4. TAILWIND RULE

If Tailwind `@apply` is already used in an asset file:

* Do **not** recreate equivalent CSS inline
* Do **not** override Tailwind output with inline rules

Tailwind output is the **source of truth** for layout styles.

---

## 5. JAVASCRIPT SCOPE RULE

JavaScript must:

* Scope by data attributes or section wrappers
* Support multiple instances of the same section
* Avoid global selectors unless explicitly required (e.g. header)

JavaScript must **not** assume:

* Only one section exists
* Fixed DOM order
* Hard-coded IDs (except explicitly defined ones like `siteHeader`)

---

## 6. SHOPIFY EDITOR SAFETY RULE

Agents must:

* Never modify `config/settings_data.json`
* Never rely on editor state existing
* Assume sections may be added, removed, or reordered

All sections must fail gracefully if:

* Required adjacent sections do not exist
* Optional data attributes are missing

---

## 7. DEFAULTS RULE (DESIGN SAFETY)

Section default settings must:

* Match the intended production design
* Render a visually correct result without configuration
* Avoid “blank” or broken layouts by default

Options that affect layout behavior (e.g. overlap) must:

* Default to OFF unless explicitly required

---

## 8. FUTURE-PROOFING RULE

If an option is added “for future use”:

* Include it in schema
* Implement minimal plumbing
* Do **not** add unused CSS or JS branches

No speculative code.

---

## 9. WHAT TO DO IF UNSURE

If unsure whether something is:

* Static vs dynamic
* Asset vs inline
* Section vs JS responsibility

👉 **Ask before implementing**. Do not guess.

---

## SUMMARY (FOR QUICK SCAN)

* Static CSS → asset files only
* Dynamic values → CSS variables
* No duplicated styles
* No generated class explosions
* Sections wire data, assets define visuals
* Safe defaults always