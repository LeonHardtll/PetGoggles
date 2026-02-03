# Bolt's Journal

## 2025-05-23 - React Animation Performance
**Learning:** React state updates (e.g., `useState`) in high-frequency animation loops (like `mousemove` or `setInterval`) cause full component re-renders, which is a major performance bottleneck.
**Action:** Use `useRef` and direct DOM manipulation for high-frequency updates (e.g., sliders, drag interactions). Use `requestAnimationFrame` for smoother animations.
