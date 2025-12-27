# Bolt's Journal

## 2024-05-21 - React Animation Performance
**Learning:** High-frequency animations (like sliders or continuous loops) in React components should avoid storing position in `useState`. State updates trigger full component re-renders (including children), which causes jank on low-end devices.
**Action:** Use `useRef` to store mutable values (like coordinates) and `requestAnimationFrame` with direct DOM manipulation (via `ref.current.style`) to achieve 60fps animations without React render overhead.
