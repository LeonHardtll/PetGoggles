# Palette's Journal

Records of critical UX and accessibility learnings.

## 2024-05-22 - Custom Slider Accessibility
**Learning:** Custom slider components built with `div`s are completely invisible to screen readers and keyboard users unless explicitly managed. They require `role="slider"`, `tabIndex={0}`, and `onKeyDown` handlers for Arrow keys to be compliant. Visual focus states (`focus-visible`) are also critical for keyboard navigation.
**Action:** Always wrap custom interactive elements in a container that accepts focus and implements standard ARIA roles and keyboard handlers. Ensure `aria-valuenow` is updated dynamically.
