## 2026-01-14 - Redundant Render Layers & Animation Loop
**Learning:** Found a component rendering the same heavy image layer 3 times due to abandoned code blocks, alongside a state-driven animation loop running at 20fps.
**Action:** Always check for duplicate/commented-out-but-rendered markup when optimizing. Switch high-frequency animations to `requestAnimationFrame` + `useRef` to decouple from React render cycle.
