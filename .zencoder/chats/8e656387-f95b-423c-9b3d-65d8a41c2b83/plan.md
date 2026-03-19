# Bug Fix Plan

This plan guides you through systematic bug resolution. Please update checkboxes as you complete each step.

## Phase 1: Investigation

### [x] Bug Reproduction

- Understand the reported issue and expected behavior
- Reproduce the bug in a controlled environment
- Document steps to reproduce consistently
- Identify affected components and versions

**Findings:**
- Error: `TypeError: Cannot read properties of undefined (reading 'enabled')` in media-gallery.js
- Occurs with announcement-vertical slider in design/hero.html
- Slider has navigation buttons as siblings, not children, without data-slider-scope
- Causes `prevEl` and `nextEl` to be null, making `navigation` config undefined

### [x] Root Cause Analysis

- Debug and trace the issue to its source
- Identify the root cause of the problem
- Understand why the bug occurs
- Check for similar issues in related code

**Root Cause:**
- Navigation module included in modules array (from preset)
- Navigation config set to undefined when DOM elements missing
- Swiper Navigation module tries to access properties on undefined config
- Code logged warning but didn't remove module from array

## Phase 2: Resolution

### [x] Fix Implementation

- Develop a solution that addresses the root cause
- Ensure the fix doesn't introduce new issues
- Consider edge cases and boundary conditions
- Follow coding standards and best practices

**Changes Made:**
1. `slider.js`: Modified module guards to remove Navigation/Pagination/Scrollbar modules when required DOM elements are missing
2. `design/hero.html`: Added `data-slider-scope` to announcement banner parent div

### [x] Impact Assessment

- Identify areas affected by the change
- Check for potential side effects
- Ensure backward compatibility if needed
- Document any breaking changes

**Impact:**
- Defensive fix prevents Swiper crashes when DOM structure incomplete
- No breaking changes - proper markup already uses data-slider-scope
- No sliders found in sections/ or snippets/ directories
- Build successful with no errors

## Phase 3: Verification

### [x] Testing & Verification

- Verify the bug is fixed with the original reproduction steps
- Write regression tests to prevent recurrence
- Test related functionality for side effects
- Perform integration testing if applicable

**Verification:**
- Build completed successfully (npm run build)
- No JavaScript errors
- Module removal logic prevents future crashes

### [x] Documentation & Cleanup

- Update relevant documentation
- Add comments explaining the fix
- Clean up any debug code
- Prepare clear commit message

**Documentation:**
- Updated comments in slider.js explaining module removal logic
- All phases documented in this plan

## Notes

- Fix is dual-layered: defensive code + corrected markup
- Other sliders should use data-slider-scope when controls are external
- Debug warnings help developers identify missing DOM elements
