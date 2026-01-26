## 2026-01-26 - Accessible Custom Sliders
**Learning:** Custom slider components (using divs) completely exclude keyboard users and screen readers unless explicitly managed. Adding `role="slider"`, `tabIndex={0}`, and `onKeyDown` handlers transforms a purely visual element into an accessible tool.
**Action:** Always wrap custom drag handles with ARIA roles and implement Arrow key support (typically +/- 5% or 10%) for keyboard navigation.
