## 2024-05-23 - Custom Slider Accessibility
**Learning:** Custom interactive components like sliders often rely on mouse events but neglect keyboard users and screen readers. Adding `role="slider"`, `aria-valuenow`, `tabIndex={0}`, and proper keyboard event handlers (`ArrowLeft`, `ArrowRight`) transforms a mouse-only widget into a fully accessible control.
**Action:** When creating or auditing custom interactive controls, always verify: 1) Can I focus it with Tab? 2) Can I operate it with Arrow keys? 3) Does a screen reader announce its value and role?
