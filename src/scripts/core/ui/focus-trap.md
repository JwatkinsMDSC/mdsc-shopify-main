# Required markup for focus trapping

Add this attribute to **modals and drawers only**:

```html
<div
  data-ui-panel
  data-ui-trap-focus
>
```

Do **not** add this to:

* dropdowns
* mega menus

---

## Why this implementation is correct

### WCAG compliant

* Focus cannot escape
* Keyboard-only users are supported
* Escape key still works (handled elsewhere)

### Stack-safe

* Nested drawers work correctly
* Focus always belongs to topmost panel

### No global pollution

* Keydown listener added only when needed
* Removed cleanly when last trap closes

### Dawn-grade

* No assumptions about markup
* Safe on section reloads
* Explicit opt-in behavior

---

## Typical use cases

| UI Type      | Focus Trap |
| ------------ | ---------- |
| Modal        | Yes        |
| Cart Drawer  | Yes        |
| Bottom Sheet | Yes        |
| Mega Menu    | No         |
| Dropdown     | No         |

---

## Next logical steps

You now have:

* scroll locking
* focus trapping
* panel controller foundation

Next we can:

* wire scroll-lock + focus-trap into the modal/drawer controller
* implement stacked drawer logic
* add close-on-route-change
* add accessibility roles (`role="dialog"`, `aria-modal="true"`)