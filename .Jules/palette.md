## 2026-01-05 - Custom Slider Accessibility
**Learning:** Custom slider components built with s are completely invisible to screen readers and keyboard users unless they implement , , and proper  attributes. Adding  handlers for Arrow keys is essential for basic usability.
**Action:** Always wrap custom interactive controls in semantic HTML or rigorously apply ARIA roles and keyboard handlers. Pause auto-animations on focus, not just hover.
## 2026-01-05 - Custom Slider Accessibility
**Learning:** Custom slider components built with divs are completely invisible to screen readers and keyboard users unless they implement role='slider', tabIndex={0}, and proper aria-* attributes. Adding onKeyDown handlers for Arrow keys is essential for basic usability.
**Action:** Always wrap custom interactive controls in semantic HTML or rigorously apply ARIA roles and keyboard handlers. Pause auto-animations on focus, not just hover.
