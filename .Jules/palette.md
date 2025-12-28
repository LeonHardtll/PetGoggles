## 2024-05-23 - Custom Slider Accessibility
**Learning:** Custom interactive components like sliders must manage `focus` state explicitly to pause auto-animations (e.g., `isHovering || isFocused`), ensuring keyboard users maintain control without the UI fighting them.
**Action:** Always pair `onMouseEnter`/`onMouseLeave` with `onFocus`/`onBlur` for auto-playing UI elements, and use `group-focus-visible` to target inner elements (like handles) from a focusable parent container.
