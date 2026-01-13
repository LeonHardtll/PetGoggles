## 2024-05-23 - React State Animation Bottleneck
**Learning:** High-frequency animations driven by `setInterval` and React state (e.g., `useState`) cause excessive re-renders (20+ FPS), blocking the main thread and draining battery.
**Action:** Use `requestAnimationFrame` with `useRef` for mutable state and direct DOM manipulation (`element.style.transform`) to achieve 60 FPS without triggering React reconciliation.

## 2024-05-23 - Manual DOM vs React Reconciliation
**Learning:** When manually updating DOM styles via `ref` (e.g., for animation), React's next render will overwrite these changes if the JSX has a conflicting `style` prop (even a static one).
**Action:** Remove the conflicting style property from JSX and use `useLayoutEffect` to initialize/restore the DOM state from the ref immediately after every render.

## 2024-05-23 - Ghost DOM Layers
**Learning:** Legacy or experimental code blocks ("re-implementing...", "retry logic") often leave behind multiple invisible DOM layers that still consume layout and paint resources.
**Action:** Audit complex UI components for overlapping, visually identical layers (using z-index or opacity) and remove them to reduce paint cost.
