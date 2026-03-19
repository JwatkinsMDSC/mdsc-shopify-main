## Task: Replace Tailour B2B Boilerplate With Existing `b2b-*` Theme Architecture

### Objective

Remove the temporary Tailour based B2B implementation and fully integrate the existing, production ready B2B sections, snippets, and templates that are prefixed with `b2b-`. The end state should use **one unified theme** where B2B and retail experiences are switched dynamically at runtime, without duplicating products or reassigning templates at scale.

---

### Background Context

* The current theme started from a Tailour boilerplate that was used only to stand up early B2B pages.
* A complete, custom B2B system now exists:

  * Sections: `b2b-*`
  * Snippets: `b2b-*`
  * Templates: `b2b-*`
* Thousands of products already have custom templates assigned and **must not** be reassigned.
* B2B vs Retail is determined at request time using:

  * Logged in customer state
  * `customer.metafields.custom.is_b2b == true`
  * Optional `?view=b2b` override for preview

---

### High Level Strategy

* **Do not create or assign new product templates**
* **Do not duplicate product JSON templates**
* Introduce a **router layer** that conditionally renders B2B or Retail root sections
* Gradually remove Tailour specific sections and dependencies once replaced

---

### Required Deliverables

#### 1. Identify and Inventory Existing B2B Assets

Create a reference list of all existing B2B theme assets:

* Sections: `sections/b2b-*.liquid`
* Snippets: `snippets/b2b-*.liquid`
* Templates: `templates/*b2b*` (if any)
* Assets used only by B2B (JS, CSS)

This inventory will be used to validate parity when replacing Tailour components.

---

#### 2. Create a Single Router Section (Core Requirement)

Create a new section:

```
sections/product-router.liquid
```

**Responsibilities:**

* Decide B2B vs Retail at render time
* Be the ONLY place conditional logic exists

**Logic Requirements:**

* Render B2B when:

  * `customer` exists AND `customer.metafields.custom.is_b2b == true`
  * OR `request.design_mode` AND `view == 'b2b'`
* Otherwise render Retail

**Example Logic (reference only):**

```liquid
{% if customer and customer.metafields.custom.is_b2b == true or request.design_mode and request.params.view == 'b2b' %}
  {% section 'b2b-product-root' %}
{% else %}
  {% section 'product-root' %}
{% endif %}
```

---

#### 3. Convert Existing Product Templates to Use the Router

For **every existing product JSON template**:

* Replace the main section with `product-router`
* Do NOT alter template filenames
* Do NOT reassign templates to products

Example:

```json
{
  "sections": {
    "router": {
      "type": "product-router"
    }
  },
  "order": ["router"]
}
```

This guarantees:

* Zero product reassignment
* Full compatibility with existing custom templates
* Centralized B2B switching logic

---

#### 4. Map Tailour Sections to Existing B2B Sections

For each Tailour B2B section currently in use:

* Identify the equivalent `b2b-*` section
* Replace references inside:

  * Templates
  * Parent sections
  * Snippets

Rules:

* No Tailour section should remain in active B2B rendering paths
* Retail sections must remain untouched

---

#### 5. Clean Up Tailour B2B Dependencies

After successful replacement:

* Remove unused Tailour B2B sections
* Remove Tailour specific snippets not used by retail
* Remove Tailour CSS and JS only used by B2B pages

Do NOT:

* Remove shared utilities
* Remove anything used by retail pages

---

#### 6. Validation Checklist

The agent must confirm:

* B2B product pages render using `b2b-*` sections
* Retail product pages render unchanged
* `?view=b2b` works in theme preview
* No products require template reassignment
* No Liquid errors in logs
* No Tailour B2B sections render in production

---

### Explicit Non Goals

* No new B2B UI design
* No refactoring of existing `b2b-*` logic
* No metafield schema changes
* No Shopify Plus features required

---

### Acceptance Criteria

* Tailour B2B boilerplate fully removed
* Existing B2B system is the only B2B renderer
* One unified product template architecture
* Zero disruption to retail storefront