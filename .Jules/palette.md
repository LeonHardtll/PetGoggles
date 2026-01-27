# Palette's Journal

## 2024-10-24 - Custom Slider Accessibility
**Learning:** Custom visual sliders (like image comparison tools) often completely lack keyboard accessibility by default, locking out non-mouse users.
**Action:** Always implement `role="slider"`, `tabIndex={0}`, `aria-valuenow`, and custom `onKeyDown` handlers for Arrow keys when building custom range inputs.
