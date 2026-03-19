# 1️⃣ What are “Form Helpers” 

In UI Core, **Form Helpers** are *behavioral enhancements* that:

* Improve UX consistency across all forms
* Reduce repeated boilerplate JS
* Handle common patterns declaratively
* Do **not** replace validation libraries or backend logic

They sit in the middle layer:

```
HTML (forms)
↓
Form Helpers (UX + behavior)
↓
Validation / submission / APIs
```

They **do not**:

* submit forms
* validate business rules
* manage application state

They **do**:

* normalize interactions
* improve accessibility
* reduce edge cases
* make forms feel “polished”

---

# 2️⃣ What this `form-helpers.js` will do (scope locked)

This first version intentionally focuses on **high-value, low-risk helpers**.

## Included behaviors (v1)

### ✅ 1. Auto-disable submit buttons on submit

Prevents double submissions.

```html
<form data-form>
```

### ✅ 2. Restore submit buttons on reset or error

Keeps UI from getting stuck.

### ✅ 3. Auto-focus first invalid field

Accessibility + UX win.

```html
<input aria-invalid="true">
```

### ✅ 4. Declarative loading state

Toggle loading classes during submit.

```html
<button data-submit>
```

### ✅ 5. Graceful handling of disabled fields

Avoids accidental focus traps.

---

## Explicitly NOT included (for now)

* Validation rules
* Async submission
* Error messaging systems
* Input masking
* Formatting logic

Those can layer on later **without breaking this file**.

---

# 3️⃣ `form-helpers.js` (STRICTLY policy-compliant)

📁 **`src/scripts/core/ui/form-helpers.js`**

---

# 4️⃣ Supporting CSS (optional but recommended)

You control visuals. This is just a sane default.

```css
button.is-loading {
  @apply opacity-60 cursor-not-allowed;
}
```

---

# 5️⃣ Example HTML — INTERNAL TESTING

Drop this into your UI test page.

---

## ✅ Basic submit prevention

```html
<form data-form class="max-w-md space-y-4">
  <h2 class="text-lg font-semibold">
    Form Helpers Test
  </h2>

  <label class="block">
    <span>Email</span>
    <input
      type="email"
      required
      class="border p-2 w-full"
    >
  </label>

  <button
    type="submit"
    data-submit
    class="border px-4 py-2"
  >
    Submit
  </button>

  <button
    type="reset"
    class="border px-4 py-2"
  >
    Reset
  </button>
</form>
```

### Test checklist

* Click submit twice → only one submission
* Submit with empty email → focus moves to input
* Submit button disables during submit
* Reset re-enables submit

---

## ✅ Multiple submit buttons

```html
<form data-form class="max-w-md space-y-4 mt-8">
  <input required placeholder="Required field" class="border p-2 w-full">

  <div class="flex gap-2">
    <button data-submit type="submit">Save</button>
    <button data-submit type="submit">Save & Continue</button>
  </div>
</form>
```

### Validate

* Both buttons disable together
* No partial states

---

## ✅ Shopify section reload safety

* Place the form inside a Shopify section
* Reload section via Theme Editor
* Confirm:

  * No duplicate listeners
  * Submit still disables buttons
  * Invalid focus still works

---

# 6️⃣ Why this is useful long-term

This file becomes the **foundation** for future enhancements like:

* Inline error summaries
* Async submit helpers
* Loading spinners
* Field-level helpers
* Conditional fields
* Multi-step forms

Without ever touching:

* Tabs
* Accordions
* Panels
* Toasts

---

## Status

✅ Form Helpers implemented
✅ Coding standards met
✅ Shopify safe
✅ Scope locked

---

When you’re ready, the strongest next components are:

* **Sliders / Carousels**
* **Stepper / Wizard**
* **Advanced Form Enhancements**

Just say what’s next and we’ll keep the roll going.
