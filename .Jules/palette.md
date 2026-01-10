## 2024-05-23 - Accessibility in Custom Sliders
**Learning:** Custom slider components must implement `role='slider'`, `tabIndex={0}`, and keyboard event handlers (Arrow keys) to be accessible. Simply using mouse events excludes keyboard and screen reader users.
**Action:** Always check interactive components for keyboard accessibility and add ARIA roles/attributes.
