---
description: Tailwind CSS Architecture & Component Import Rules
alwaysApply: true
---

# Marine Detail Supply Tailwind CSS Rules

## Summary
This repository uses a **CSS-first Tailwind v4 architecture** with modular component styles. All visual components are defined as standalone CSS files and **must be explicitly imported** into the main Tailwind entry file to be included in the compiled output.

Failure to import a component CSS file into the main Tailwind entry will result in the component **not existing at runtime**, even if the CSS file itself is correct.

---

## Tailwind Entry Point (Critical)
The **only compiled Tailwind entry file** is:

```

/home/playerreplay/projects/mdsc-shopify-theme/src/styles/tailwind.css

```

All Tailwind utilities, components, plugins, and custom styles are built **exclusively** from this file.

If a CSS file is not imported here, it does not exist in the final build.

---

## Component Directory Structure
All Tailwind-based components live in:

```

/home/playerreplay/projects/mdsc-shopify-theme/src/styles/components/

````

Each file in this directory defines one or more reusable Tailwind components using:

- `@layer components`
- `@apply`
- CSS variables where needed

Example component files include:
- `buttons.css`
- `product-card.css`
- `modal.css`
- `loading.css`
- `tooltip.css`
- `countdown.css`

---

## Mandatory Import Rule (Hard Rule)

### Any component CSS file MUST be imported into `tailwind.css`

Example (required pattern):

```css
@import "./components/loading.css";
````

If a component is created, modified, or referenced in markup:

* The agent **must verify** it is imported in `tailwind.css`
* The agent **must add the import** if missing
* The agent **must never assume** auto-discovery or glob imports

There is **no automatic component inclusion**.

---

## Common Failure Mode (Explicitly Documented)

### ❌ Incorrect Assumption

> “The CSS file exists, so the styles should work.”

This is false.

### ✅ Correct Mental Model

> “If the file is not imported in `tailwind.css`, Tailwind will not compile it, and the styles do not exist.”

---

## Agent Responsibilities (Must Follow)

When debugging or implementing CSS:

1. Locate the component CSS file in `src/styles/components/`
2. Confirm it contains valid `@layer components` rules
3. Confirm it is imported in `src/styles/tailwind.css`
4. If missing, add the import in a stable, deterministic order

The agent must **always check imports first** before assuming:

* Broken Tailwind utilities
* Mask/image issues
* Browser incompatibilities
* Animation failures

---

## Import Order Guidance

Component imports should remain grouped and explicit.

Preferred pattern:

```css
@import "./components/forms.css";
@import "./components/buttons.css";
@import "./components/avatars.css";
@import "./components/badges.css";
@import "./components/chips.css";
@import "./components/product-card.css";
@import "./components/collection-card.css";
@import "./components/swiper.css";
@import "./components/filters.css";
@import "./components/modal.css";
@import "./components/tooltip.css";
@import "./components/banner-offers.css";
@import "./components/countdown.css";
@import "./components/dock.css";
@import "./components/rating.css";
@import "./components/color-picker.css";
@import "./components/loading.css";
```

---

## Prohibited Assumptions

* Do NOT assume Tailwind scans component CSS automatically
* Do NOT assume component CSS is bundled unless imported
* Do NOT debug runtime visuals before verifying imports
* Do NOT suggest JavaScript fixes for missing CSS

---

## Validation Checklist (Required)

Before concluding a CSS issue is “broken”:

* [ ] Component CSS file exists
* [ ] Component CSS uses `@layer components`
* [ ] Component CSS is imported in `tailwind.css`
* [ ] Tailwind build has been re-run

---

## Summary Rule

**If a Tailwind component CSS file is not imported into `tailwind.css`, it does not exist.**

This rule is absolute and overrides all other assumptions.

```