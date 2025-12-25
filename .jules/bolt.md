## 2024-05-23 - [Optimization Pattern: Direct DOM for Sliders]
**Learning:** High-frequency animations (e.g., sliders, continuous loops) should rely on `useRef`, `requestAnimationFrame`, and direct DOM manipulation rather than React state to avoid performance degradation from frequent re-renders.
**Action:** When implementing interactive sliders or continuous animations, use `ref.current.style.setProperty` or similar techniques instead of `useState`.
