Perfect. We’ll tackle **Tabs** first and build them to the **same standard** you’ve now established for Dropdowns, Modals, and Drawers.

This will be a **Dawn-grade, core UI Tabs system**, not a one-off component.

I’ll structure this in four parts:

1. **Design goals & behavior (lock this in)**
2. **Data-attribute API (authoring contract)**
3. **Tabs controller architecture (how it works)**
4. **Example HTML you can test immediately**

No feature creep. No optional fluff. This is the baseline you can ship and extend later.

---

## 1️⃣ Tabs – Design Goals (Authoritative)

Tabs should:

* Be **fully declarative** (HTML-driven)
* Support **multiple tab groups on a page**
* Be **keyboard accessible** (WCAG)
* Work with **Shopify section reloads**
* Support **dynamic content height**
* Preserve state **within the group only**
* Not depend on CSS tricks or hash routing

### Explicit non-goals (for now)

* No URL hash syncing
* No lazy-loading panels
* No animation presets baked in (we’ll allow optional animation later)

---

## 2️⃣ Tabs – Data Attribute API (Consistent with your system)

We follow the same pattern you’ve already set:

### Required roles (for accessibility)

* `role="tablist"`
* `role="tab"`
* `role="tabpanel"`

### Data attributes

| Element    | Attribute        |
| ---------- | ---------------- |
| Tabs root  | `data-tabs`      |
| Tab list   | `data-tabs-list` |
| Tab button | `data-tab`       |
| Tab panel  | `data-tab-panel` |

### Mapping rule

Tabs map to panels via **`aria-controls`**, exactly like your dropdowns and panels.

---

## 3️⃣ Tabs Controller – Architecture Overview

Tabs are **stateful but not modal**, so the model is simpler than panels.

### State per tab group

Each `[data-tabs]` group manages:

* active tab index
* tab buttons
* panels

### Keyboard behavior (WCAG-compliant)

* `ArrowRight` / `ArrowDown` → next tab
* `ArrowLeft` / `ArrowUp` → previous tab
* `Home` → first tab
* `End` → last tab
* `Enter` / `Space` → activate focused tab

### Visibility rules

* Only the active panel is visible
* Inactive panels are `hidden`
* Active tab has:

  * `aria-selected="true"`
  * `tabindex="0"`
* Inactive tabs:

  * `aria-selected="false"`
  * `tabindex="-1"`

---

## 5️⃣ Example HTML – Tabs Test Case

You can drop this into your test page immediately.

```html
<section class="max-w-3xl mx-auto mt-16">
  <h2 class="text-xl font-semibold mb-4">Tabs Test</h2>

  <div data-tabs>
    <!-- Tab List -->
    <div
      data-tabs-list
      role="tablist"
      class="flex gap-2 border-b"
    >
      <button
        data-tab
        aria-controls="tab-panel-1"
      >
        Description
      </button>

      <button
        data-tab
        aria-controls="tab-panel-2"
      >
        Specs
      </button>

      <button
        data-tab
        aria-controls="tab-panel-3"
      >
        Reviews
      </button>
    </div>

    <!-- Panels -->
    <div class="pt-4">
      <div
        id="tab-panel-1"
        data-tab-panel
      >
        <p>
          Product description content goes here.
        </p>
      </div>

      <div
        id="tab-panel-2"
        data-tab-panel
        hidden
      >
        <ul>
          <li>Weight: 1.2kg</li>
          <li>Material: Aluminum</li>
        </ul>
      </div>

      <div
        id="tab-panel-3"
        data-tab-panel
        hidden
      >
        <p>
          Customer reviews will appear here.
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## 6️⃣ What This Gives You

* ✔ Multiple independent tab groups
* ✔ Full keyboard accessibility
* ✔ No CSS hacks
* ✔ No global state collisions
* ✔ Works with dynamic Shopify sections
* ✔ Same architectural standards as the rest of your UI Core
