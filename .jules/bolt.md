## 2024-05-23 - React Animation Optimization
**Learning:** High-frequency animations (like auto-sweeping sliders) should leverage `useRef` and `requestAnimationFrame` with direct DOM manipulation instead of React state. React state updates at 60fps (or even 20fps) can cause significant re-render overhead for the entire component tree.
**Action:** When implementing continuous animations, verify if state is actually needed for rendering other parts of the UI. If not, use refs and direct style updates.

## 2024-05-23 - Ghost Components
**Learning:** Be careful with commented-out code or duplicate components in JSX. In `HeroComparison.tsx`, there were multiple versions of the "Layer 2" div rendered simultaneously (some likely intended to be replacements but left in), causing unnecessary DOM nodes and paint operations.
**Action:** Always clean up unused code and verify the DOM structure to ensure no "ghost" components are being rendered.
