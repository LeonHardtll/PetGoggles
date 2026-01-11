## 2026-01-11 - React Animation Performance
**Learning:** High-frequency state updates (like 60fps animations) in React components cause significant re-render overhead.
**Action:** Move animation state (like positions) to `useRef` and animate via `requestAnimationFrame` with direct DOM manipulation (`ref.current.style.x = ...`) to bypass React's render cycle completely. Only use state for low-frequency updates (e.g., toggles, layout changes).
