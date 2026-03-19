# Bug Fix Plan

This plan guides you through systematic bug resolution. Please update checkboxes as you complete each step.

## Phase 1: Investigation

### [x] Bug Reproduction

- ✅ Understand the reported issue and expected behavior
- ✅ Reproduce the bug in a controlled environment
- ✅ Document steps to reproduce consistently
- ✅ Identify affected components and versions

**Findings:**
- Both next/prev buttons move slider in same direction
- Hero collection slider uses old markup pattern
- Data attributes on slider element instead of buttons

### [x] Root Cause Analysis

- ✅ Debug and trace the issue to its source
- ✅ Identify the root cause of the problem
- ✅ Understand why the bug occurs
- ✅ Check for similar issues in related code

**Root Cause:**
- Slider element has `data-slider-next` and `data-slider-prev` attributes with class values
- JavaScript uses `querySelector('[data-slider-prev]')` which finds the slider element itself
- Both prevEl and nextEl reference the same element (slider container)
- Actual button elements don't have the required data attributes

## Phase 2: Resolution

### [x] Fix Implementation

- ✅ Develop a solution that addresses the root cause
- ✅ Ensure the fix doesn't introduce new issues
- ✅ Consider edge cases and boundary conditions
- ✅ Follow coding standards and best practices

**Solution Applied:**
- Removed `data-slider-next="swiper-hero-btn btn-next"` from slider element
- Removed `data-slider-prev="swiper-hero-btn btn-prev"` from slider element
- Added `data-slider-prev` attribute to the prev button element
- Added `data-slider-next` attribute to the next button element
- Fixed file: `/home/playerreplay/projects/mdsc-shopify-theme/design/hero.html`

### [x] Impact Assessment

- ✅ Identify areas affected by the change
- ✅ Check for potential side effects
- ✅ Ensure backward compatibility if needed
- ✅ Document any breaking changes

**Assessment Results:**
- Bug was isolated to `design/hero.html` only
- Checked all other design files - all use correct pattern
- Sections in `/sections/` use old Swiper integration (not affected)
- No breaking changes - only fixes incorrect markup
- No other files require updates

## Phase 3: Verification

### [ ] Testing & Verification

- Verify the bug is fixed with the original reproduction steps
- Write regression tests to prevent recurrence
- Test related functionality for side effects
- Perform integration testing if applicable

### [ ] Documentation & Cleanup

- Update relevant documentation
- Add comments explaining the fix
- Clean up any debug code
- Prepare clear commit message

## Notes

- Update this plan as you discover more about the issue
- Check off completed items using [x]
- Add new steps if the bug requires additional investigation
