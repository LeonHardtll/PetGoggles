## 2024-02-14 - Direct DOM Manipulation for High-Frequency Animation
**Learning:** High-frequency state updates (like slider dragging or 60fps animations) in React components can cause significant performance degradation due to frequent reconciliation/re-renders.
**Action:** Use `useRef` to store mutable state and modify DOM elements directly (via `ref.current.style`) for interactions like sliders or continuous animations, bypassing the React render cycle.
