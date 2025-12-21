## 2024-05-23 - State-Driven Animations vs Refs
**Learning:** High-frequency animations (like 60fps loops) driven by React state (`useState` + `setInterval`) cause full component re-renders on every frame, leading to high CPU usage and potential jank.
**Action:** Use `useRef` for mutable values and `requestAnimationFrame` for the loop. Update DOM elements directly via refs to bypass React's render cycle for purely visual, high-frequency updates.
