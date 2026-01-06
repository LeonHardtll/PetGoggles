## 2024-05-23 - Custom Slider Accessibility
**Learning:** Custom slider components (like image comparison tools) often rely solely on mouse/touch events, completely excluding keyboard and screen reader users. They require manual implementation of `role="slider"`, `tabIndex={0}`, and `onKeyDown` handlers for arrow keys to be accessible.
**Action:** Always check custom interactive components for keyboard accessibility and standard ARIA roles, as they don't get these "for free" like native `<input type="range">`.
