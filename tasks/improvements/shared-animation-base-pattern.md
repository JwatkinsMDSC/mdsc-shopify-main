# 📄 3. Shared Animation Base Pattern (Feature Enhancement – Optional)

### **File name**
```

shared-animation-base-pattern.md

```

### **Location**
```

src/scripts/core/ui/shared-animation-base-pattern.md

````

---

### **Contents**

```md
# Feature Enhancement: Shared Animation Base Pattern

## Status
Proposed  
Optional  
Non-blocking

---

## Overview

Multiple UI controllers now implement similar animation infrastructure:

- requestAnimationFrame loops
- pause coordination
- reduced motion handling
- visibility awareness
- cleanup logic

Examples:
- marquee.js
- slider.js (autoplay)
- future animated UI

This document proposes a **shared animation base pattern** to reduce duplication and improve consistency.

---

## Problem

Each controller currently:
- reimplements pause logic
- manages its own RAF lifecycle
- handles cleanup independently

This leads to:
- subtle inconsistencies
- duplicated code
- harder future changes

---

## Proposed Solution

Introduce a **lightweight animation base pattern** (not a class, not inheritance-heavy) that standardizes:

- RAF lifecycle
- PauseManager integration
- Reduced motion guard
- Visibility hooks
- Cleanup contract

---

## Design Principles

- Composition over inheritance
- No DOM assumptions
- Controller remains in control
- Opt-in usage
- No breaking changes

---

## Example Concept (Illustrative)

```js
const animation = createAnimationController({
  onTick(dt) {
    // controller-specific animation logic
  },
});
````

Internally, the base controller would manage:

* RAF loop
* pause.isPaused()
* reduced motion
* teardown hooks

---

## Non-Goals

* No framework abstraction
* No required refactor
* No magic lifecycle
* No forced adoption

---

## Intended Benefits

* Consistent behavior across animated UI
* Fewer bugs related to pause state
* Easier onboarding for new contributors
* Faster future enhancements

---

## Relationship to PauseManager

PauseManager remains mandatory.

This pattern would **consume PauseManager**, not replace it.

---

## Next Steps (Optional)

* Apply PauseManager + visibility guards to slider.js
* Identify duplicated RAF patterns
* Decide whether a base abstraction is worthwhile

---

## Summary

This is a future optimization, not a requirement.

The current architecture is correct.
This proposal exists to reduce long-term maintenance cost.

```