# PauseManager Usage Policy (Authoritative)

## Status

**Canonical**

Required for all animated UI controllers going forward.

---

## Purpose

`PauseManager` exists to coordinate **multiple independent pause conditions** in a deterministic, conflict-free way.

Any controller that:
* animates continuously
* uses `requestAnimationFrame`
* autoplays content
* runs while user is idle

**MUST** use `PauseManager`.

---

## Approved Pause Sources

Pause reasons must be:
* Named (string identifiers)
* Additive
* Independently removable

Common reasons include:
* `"reduced-motion"`
* `"viewport"`
* `"layout"`
* `"hover"`
* `"focus"`
* `"visibility"`

---

## Required Pattern

### 1. Instantiate per controller instance

```js
const pause = createPauseManager();
```

Never shared. Never global.

---

### 2. Add pause reasons, never overwrite state

❌ Forbidden:
```js
state.paused = true;
```

✅ Required:
```js
pause.add('viewport');
pause.remove('viewport');
```

---

### 3. Gate all animation in exactly one place

```js
if (!pause.isPaused()) {
  animate();
}
```

No other part of the controller may directly control motion.

---

### 4. Reduced motion is a permanent pause

```js
if (prefersReducedMotion()) {
  pause.add('reduced-motion');
}
```

This pause reason must never be removed.

---

## Enforcement (important)

Any future PR or Coding Agent task that:
* introduces continuous animation
* introduces autoplay
* introduces timed motion

**must reference PauseManager explicitly**.

If not present, the change is considered incomplete.

---

## Why this rule exists

* Prevents conflicting pause logic
* Prevents hidden background animation
* Improves accessibility compliance
* Makes debugging deterministic
* Ensures consistent behavior across marquee, slider, gallery, etc.
