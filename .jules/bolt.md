## 2024-05-24 - Ghost Components
**Learning:** Found abandoned UI layers in `HeroComparison.tsx` that were still being rendered behind the active layer. These "ghost components" needlessly consumed resources and DOM nodes.
**Action:** Aggressively audit complex components for overlaid/redundant elements that might be legacy code.

## 2024-05-24 - Animation State Anti-Pattern
**Learning:** The auto-sweep animation used `setInterval` updating React state, causing full component re-renders at 20fps.
**Action:** Always prefer `requestAnimationFrame` with direct DOM manipulation (via refs) for high-frequency animations to bypass the React render cycle.
