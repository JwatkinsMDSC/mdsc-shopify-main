---
description: Shopify Theme JavaScript & Component Architecture Rules
alwaysApply: true
---

# Shopify Theme JavaScript & Component Architecture Rules

Authoritative rules for generating and refactoring **JavaScript in Shopify Liquid themes**.

These rules enforce:
- Shopify theme compatibility
- Long-term maintainability
- Safe behavior under dynamic DOM replacement
- Clear ownership boundaries
- Zero reliance on modern SPA assumptions

This ruleset is **non-negotiable**.

---

## Summary Assumptions (MANDATORY)

All JavaScript must assume:

- ❌ No bundler
- ❌ No ES module imports / exports
- ❌ No Vite, Webpack, Rollup, or build step
- ❌ No framework lifecycle guarantees
- ✅ Script loading via theme `assets/`
- ✅ Dynamic DOM replacement at any time
- ✅ Multiple instances of the same UI on one page

---

## Core Principles

### 1. Shopify Themes Are NOT SPAs

- Do NOT treat the theme as a single-page application
- Do NOT assume persistent DOM
- Do NOT rely on mount/unmount lifecycles
- Do NOT assume scripts run only once

Any section, block, or HTML subtree may be replaced at any time.

---

### 2. Vanilla JavaScript Is the Baseline

- Use plain JavaScript only
- Do NOT introduce frameworks (React, Vue, Alpine, etc.)
- Do NOT simulate framework patterns

Vanilla JS + data attributes is the professional Shopify standard.

---

### 3. No Build Tool Assumptions

The agent must NOT assume:

- ES modules
- Import / export syntax
- Tree-shaking
- Code splitting
- Source vs build directories

All JavaScript must work when loaded directly via:

```liquid
{{ 'file.js' | asset_url | script_tag }}
````

---

## Global Namespace Rules

### 4. Single Global Namespace (REQUIRED)

All shared logic MUST live under **one** namespace:

```js
window.B2B = window.B2B || {};
```

Allowed:

```js
window.B2B.ProductState
window.B2B.ProductControllers
window.B2B.Components.Quantity
```

Disallowed:

* Unscoped globals
* Multiple top-level namespaces
* Anonymous globals

---

## Component & Controller Architecture

### 5. Component Definition

A “component” is:

* Reusable behavior
* Applied to existing markup
* Activated via data attributes
* Stateless or minimally stateful

Components MUST NOT:

* Own business logic
* Depend on layout hierarchy
* Generate persistent markup

---

### 6. Controller Definition

A “controller”:

* Orchestrates multiple components
* Is scoped to a root element
* Wires state → behavior → UI

Controllers MUST NOT:

* Be global singletons
* Mutate unrelated DOM
* Assume page context

---

### 7. One Authority Per Behavior

Each behavior must exist in **exactly one place**.

Examples:

* Quantity logic
* Variant selection
* Pricing display
* Inventory messaging

Feature code must **call**, never duplicate.

---

### 8. Required Component API

All reusable components MUST expose:

```js
init(root = document)
destroy(root = document)
```

Rules:

* `init()` must be idempotent
* Safe to re-run after DOM replacement
* Scoped strictly to the provided root
* No duplicate listeners

---

## State Management Rules

### 9. Centralized Product State (Per Instance)

Each product instance MUST have:

* A single ProductState object
* Attached to its root element
* No global shared state between products

State:

* Stores data only
* Emits updates
* Never touches the DOM

---

### 10. State-Driven UI (Required)

UI updates MUST be driven by:

* State subscriptions
* Not by event chaining between controllers

Events may exist, but **state is the authority**.

---

## Data Attribute Contract

### 11. Data Attributes Are the API

JavaScript MUST rely exclusively on data attributes.

Allowed:

```html
<button data-qty-increase></button>
<div data-base-price></div>
```

Disallowed:

* Class-based traversal
* Assumed DOM structure
* Hardcoded parent/child relationships

---

## DOM Lifecycle & Reinitialization

### 12. Explicit Reinitialization Is REQUIRED

After any DOM mutation, code MUST explicitly re-run:

```js
window.B2B.init(root)
```

Examples:

* AJAX updates
* Quick view modals
* Section reloads
* Theme Editor changes

Implicit discovery is NOT allowed.

---

### 13. Shopify Theme Editor Compatibility

JavaScript MUST support:

* `DOMContentLoaded`
* `shopify:section:load`
* `shopify:section:unload`
* `shopify:block:select` (if relevant)

Code must never break during live editing.

---

## Tooltip & Overlay Rules

### 14. Tooltips Must Use Portals

Tooltips MUST:

* Render under `document.body`
* Use `position: fixed`
* Ignore layout stacking contexts

Tooltips MUST NOT:

* Live inside overflow containers
* Rely on z-index escalation

---

### 15. Tooltip Ownership

Only the tooltip component may:

* Create tooltip DOM
* Position tooltips
* Destroy tooltips

Feature code must treat tooltips as opaque.

---

## Liquid + JavaScript Boundary

### 16. Liquid Outputs Structure Only

Liquid:

* Outputs semantic HTML
* Adds data attributes
* Avoids logic

JavaScript:

* Adds behavior
* Never assumes Liquid context

---

### 17. No Inline JavaScript in Liquid

Disallowed:

```liquid
onclick="..."
```

Allowed:

```liquid
data-action="add-to-cart"
```

---

## Prohibited Patterns

### 18. Explicitly Disallowed

The agent must NOT:

* Use inline scripts in snippets
* Add logic to Liquid
* Introduce frameworks
* Duplicate behavior logic
* Assume persistent DOM
* Patch issues with z-index hacks

---

## Performance & Safety

### 19. Event Handling

* Prefer event delegation where appropriate
* Avoid excessive per-node listeners
* Clean up listeners in `destroy()`

---

### 20. Defensive Programming

All JavaScript MUST:

* Guard for missing elements
* Fail safely
* Never throw runtime errors due to markup changes

---

## Final Rule (Read This Twice)

**DOM is disposable.
State is authoritative.
Behavior must be centralized.
Structure and ownership matter more than convenience.**