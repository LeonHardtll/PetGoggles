# Palette's Journal

## 2024-05-23 - Custom Slider Accessibility
**Learning:** Custom slider components often lack basic keyboard accessibility (Arrow keys, Focus).
**Action:** Always implement `role="slider"`, `tabIndex={0}`, and `onKeyDown` handlers for custom interactive elements.
