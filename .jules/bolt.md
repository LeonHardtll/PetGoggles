# Bolt's Journal

## 2024-05-22 - [Animation Loop Optimization]
**Learning:** `setInterval` for high-frequency animations (like progress bars) triggers React state updates too frequently, causing jank. `requestAnimationFrame` with ref-based DOM manipulation is smoother.
**Action:** Use `requestAnimationFrame` and direct DOM manipulation for animations that run every frame.

## 2024-05-22 - [Ref-based DOM Manipulation]
**Learning:** When using `useRef` to manipulate DOM styles directly (to avoid re-renders), the initial state must be synced via the `style` prop in JSX. Otherwise, there's a flash of unstyled content (FOUC) or incorrect state until the first effect runs.
**Action:** Always pass `style={{ ... }}` to the element in JSX that matches the initial ref value.

## 2024-05-23 - [Auto-Animate Focus Management]
**Learning:** Auto-animating components (like marquees or carousels) must pause on `onFocus` (keyboard navigation) in addition to `onMouseEnter`. Accessibility requires users to be able to stop movement to read/interact.
**Action:** Always add `onFocus` and `onBlur` handlers alongside hover handlers for pausing animations.

## 2024-05-23 - [Input Performance]
**Learning:** For inputs that update on every keystroke, avoid expensive operations or complex re-renders in the `onChange` handler.
**Action:** Debounce expensive side effects or state updates that don't need to be immediate.
