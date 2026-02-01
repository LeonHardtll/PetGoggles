## 2024-05-23 - Accessible Custom Slider
**Learning:** Custom slider components (like before/after image comparisons) built with `div`s often lack accessibility, making them unusable for keyboard and screen reader users.
**Action:** Always implement `role="slider"`, `tabIndex={0}`, `aria-valuenow`, and `onKeyDown` handlers for Arrow keys. Use the `group` and `group-focus-visible` pattern in Tailwind to ensure the visual handle shows focus rings even when the outer draggable container is the focus target.

## 2024-05-23 - Pause Animation on Focus
**Learning:** Auto-animating components can be disorienting for keyboard users and violate accessibility standards if they don't pause on focus.
**Action:** When implementing `useEffect` based animations, always include a check for `isFocused` state alongside `isHovering`. Add `onFocus` and `onBlur` handlers to the interactive element to toggle this state.
