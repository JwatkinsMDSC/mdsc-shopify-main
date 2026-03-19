# 📄 2. PauseManager Canonical Usage Guideline (Repo-Level Rule)

### **File name**
```

pause-manager-usage-guideline.md

```

### **Location**
```

src/scripts/core/ui/pause-manager-usage-guideline.md

````

---

### **Contents**

```md
# Canonical Usage Guideline: PauseManager

## Status
Authoritative  
Enforced  
Applies to all future animated UI

---

## Purpose

PauseManager is the **single canonical mechanism** for coordinating pause and resume behavior in animated UI controllers.

Any controller that:
- runs continuously
- uses requestAnimationFrame
- autoplays content
- animates without direct user input

**MUST use PauseManager.**

---

## Why This Rule Exists

Without a centralized pause coordinator:
- Pause conditions conflict
- Hidden components continue animating
- Accessibility suffers
- Debugging becomes non-deterministic

PauseManager solves this by enforcing additive, named pause reasons.

---

## Mandatory Usage Pattern

### 1. One PauseManager per instance

```js
const pause = createPauseManager();
````

PauseManager must never be global or shared.

---

### 2. Named pause reasons only

❌ Forbidden:

```js
state.paused = true;
```

✅ Required:

```js
pause.add('viewport');
pause.remove('viewport');
```

Pause reasons must be:

* strings
* human-readable
* independent

---

### 3. Single animation gate

All animation must be gated in **one location only**:

```js
if (!pause.isPaused()) {
  animate();
}
```

No other part of the controller may directly control motion.

---

### 4. Reduced motion is permanent

```js
if (prefersReducedMotion()) {
  pause.add('reduced-motion');
}
```

This pause reason must never be removed.

---

## Approved Pause Reason Examples

* reduced-motion
* viewport
* layout
* hover
* focus
* visibility
* user

---

## Enforcement Rule (Important)

Any future Coding Agent task or PR that introduces:

* autoplay
* continuous animation
* background motion

**must explicitly reference PauseManager.**

If not present, the change is considered incomplete by default.

---

## Controllers Covered

This rule applies to (but is not limited to):

* marquee.js
* slider.js
* media-gallery.js
* future animation primitives

---

## Summary

PauseManager is not optional.
It is part of the UI contract.

```