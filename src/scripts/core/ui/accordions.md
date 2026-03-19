# ✅ ACCORDIONS — CORE UI COMPONENT

## Design intent (locked)

Accordions are for **progressive disclosure** of content, not navigation.

**Behavioral rules**

* Multiple accordion groups per page
* Supports:

  * single-open (default)
  * multi-open (opt-in)
* Fully keyboard accessible (WCAG)
* Declarative HTML API
* Shopify section reload safe
* No animation assumptions (CSS handles visuals)

---

## Data Attribute API

| Element             | Attribute                 |
| ------------------- | ------------------------- |
| Accordion root      | `data-accordion`          |
| Allow multiple open | `data-accordion-multiple` |
| Accordion trigger   | `data-accordion-trigger`  |
| Accordion panel     | `data-accordion-panel`    |

Mapping is via **`aria-controls`**, consistent with Tabs and Panels.

---

## Markup example

```
<section class="max-w-4xl mx-auto mt-16">
  <h2 class="text-xl font-semibold mb-4">
    Accordion Test — Single Open
  </h2>

  <div data-accordion>
    <div class="border-b">
      <button
        data-accordion-trigger
        aria-controls="accordion-basic-1"
        aria-expanded="false"
        class="w-full text-left py-3 font-medium"
      >
        What is your return policy?
      </button>

      <div
        id="accordion-basic-1"
        data-accordion-panel
        hidden
        class="pb-4"
      >
        <p>
          You can return items within 30 days of purchase.
        </p>
      </div>
    </div>

    <div class="border-b">
      <button
        data-accordion-trigger
        aria-controls="accordion-basic-2"
        aria-expanded="false"
        class="w-full text-left py-3 font-medium"
      >
        Do you ship internationally?
      </button>

      <div
        id="accordion-basic-2"
        data-accordion-panel
        hidden
        class="pb-4"
      >
        <p>
          Yes, international shipping is available.
        </p>
      </div>
    </div>

    <div class="border-b">
      <button
        data-accordion-trigger
        aria-controls="accordion-basic-3"
        aria-expanded="false"
        class="w-full text-left py-3 font-medium"
      >
        How long does shipping take?
      </button>

      <div
        id="accordion-basic-3"
        data-accordion-panel
        hidden
        class="pb-4"
      >
        <p>
          Shipping typically takes 5–7 business days.
        </p>
      </div>
    </div>
  </div>
</section>

```

### Multi Accordion

```
<section class="max-w-4xl mx-auto mt-16">
  <h2 class="text-xl font-semibold mb-4">
    Accordion Test — Multiple Open Allowed
  </h2>

  <div data-accordion data-accordion-multiple>
    <div class="border-b">
      <button
        data-accordion-trigger
        aria-controls="accordion-multi-1"
        aria-expanded="false"
        class="w-full text-left py-3 font-medium"
      >
        Feature A
      </button>

      <div
        id="accordion-multi-1"
        data-accordion-panel
        hidden
        class="pb-4"
      >
        <p>Details about Feature A.</p>
      </div>
    </div>

    <div class="border-b">
      <button
        data-accordion-trigger
        aria-controls="accordion-multi-2"
        aria-expanded="false"
        class="w-full text-left py-3 font-medium"
      >
        Feature B
      </button>

      <div
        id="accordion-multi-2"
        data-accordion-panel
        hidden
        class="pb-4"
      >
        <p>Details about Feature B.</p>
      </div>
    </div>

    <div class="border-b">
      <button
        data-accordion-trigger
        aria-controls="accordion-multi-3"
        aria-expanded="false"
        class="w-full text-left py-3 font-medium"
      >
        Feature C
      </button>

      <div
        id="accordion-multi-3"
        data-accordion-panel
        hidden
        class="pb-4"
      >
        <p>Details about Feature C.</p>
      </div>
    </div>
  </div>
</section>
```

---

## What this gives you

* ✔ Declarative accordions
* ✔ Optional multi-open behavior
* ✔ Keyboard navigation
* ✔ No animation coupling
* ✔ Safe on section reloads
* ✔ Matches Tabs + Panels architecture
* ✔ Meets your organization’s coding standards
