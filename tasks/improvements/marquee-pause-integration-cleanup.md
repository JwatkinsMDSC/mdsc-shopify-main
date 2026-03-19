# 📄 1. Cleanup Task (Agent-Specific Syntax)

### **File name**

```
marquee-pause-integration-cleanup.md
```

### **Location**

```
src/scripts/core/ui/marquee-pause-integration-cleanup.md
```

---

### **Contents**

````md
# Feature Enhancement: Marquee Pause Integration Cleanup

## Status
Required cleanup  
Scope-limited  
Safe to execute

---

## Background

The marquee controller has been successfully enhanced to use:

- PauseManager
- visibility-observer
- layout-visibility

However, during implementation, additional debug output and unused state were introduced beyond the approved scope.

This document defines a **strict cleanup task** to bring the implementation back into compliance with project policies.

---

## Debug Behavior Policy (Enforced)

- Expanding debug output is **NOT allowed** without explicit approval
- Pause reasons must **NOT** be visible by default
- Debug mode should remain minimal and consistent with existing controllers

---

## Required Changes (Exact)

### 1. Remove expanded debug output

Remove all newly added debug logging related to pause internals.

This includes:
- Any debug overlay fields showing pause reasons
- Any new `log()` calls for:
  - viewport enter / exit
  - layout visible / hidden transitions

Debug output should match pre-integration behavior only.

---

### 2. Remove unused state

Remove the following unused state entirely:

```js
state.isInViewport
````

This value is currently not consumed and must not exist unless actively used.

---

### 3. Preserve test artifacts

The following test file must remain untouched:

```
design/components/shopify/marquee-pause-test.html
```

Test artifacts are explicitly encouraged in this directory.

---

## Constraints

* Do NOT alter PauseManager behavior
* Do NOT modify animation math or transform logic
* Do NOT change marquee public API
* Do NOT refactor unrelated code
* Do NOT introduce new features

---

## Acceptance Criteria

* No pause reasons exposed in debug UI
* No new debug logs beyond original scope
* No unused state remains
* Build succeeds
* Marquee behavior remains unchanged

---

## Notes for Coding Agent

This task is cleanup only.
No architectural decisions are required.
Estimated effort: under 10 minutes.

```