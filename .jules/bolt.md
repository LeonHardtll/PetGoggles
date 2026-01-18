## 2024-05-24 - Ghost Components & Render Loops
**Learning:** Found a component (`HeroComparison`) rendering 3 copies of the same image layer due to commented-out-but-active code blocks. Also, high-frequency state updates (60fps) were driving React re-renders.
**Action:** Always check for "ghost" components (abandoned attempts) that are still in the DOM. Use `useRef` + `requestAnimationFrame` for continuous animations to bypass React's render cycle.
