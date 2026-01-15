## 2024-05-23 - Ghost Components and Animation Loops
**Learning:** Found multiple "ghost" versions of the comparison layer rendered simultaneously (likely from abandoned experiments), causing unnecessary DOM node creation and paint operations.
**Action:** Audit complex UI components for commented-out or "hidden" but rendered layers.

## 2024-05-23 - Direct DOM Manipulation for High-Frequency UI
**Learning:** React state for 60fps animations (like auto-sweeping sliders) causes excessive re-renders.
**Action:** Use `useRef` and `requestAnimationFrame` with direct style modification for continuous animations or high-frequency interactions (drag).
