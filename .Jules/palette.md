## 2024-05-20 - [Accessible Comparison Slider]
**Learning:** Custom interactive components like "before/after" image sliders often lack basic keyboard accessibility (tab index, ARIA roles, key handlers), excluding users who cannot use a mouse.
**Action:** When implementing custom sliders:
1. Use `role="slider"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
2. Add `tabIndex={0}` to make the handle focusable.
3. Implement `onKeyDown` for Arrow keys to change values.
4. IMPORTANT: Ensure auto-playing animations (like sweeps) PAUSE when the component receives focus (`onFocus`), not just on hover.
5. Use visual focus indicators (e.g., `focus-visible:ring`) to show active state.
