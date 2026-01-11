# Palette's Journal

## 2026-01-11 - Accessible Comparison Sliders
**Learning:** Custom interactive widgets (like image comparison sliders) are often implemented as simple `div`s with mouse events, completely bypassing keyboard and screen reader users. Adding `role="slider"`, `tabIndex={0}`, and proper ARIA attributes turns a "mouse-only" toy into an accessible tool without changing the visual design.
**Action:** When creating custom drag interactions, always implement parallel keyboard handlers (`onKeyDown` for Arrows/Home/End) and ensure `aria-valuenow` reflects the visual state.
