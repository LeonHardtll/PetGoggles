## 2024-12-26 - Optimized Slider Animation
**Learning:** High-frequency UI updates (like drag sliders or continuous loops) should bypass React state/reconciliation. Using `useRef` for position tracking + `requestAnimationFrame` for direct DOM manipulation eliminates re-renders and decouples animation speed from screen refresh rate (using time-delta).
**Action:** When identifying stuttery animations or inputs, profile for high-frequency state updates and refactor to imperative DOM updates.

## 2024-12-26 - Ghost DOM Elements
**Learning:** Codebases may contain "ghost" components (unused, overlaid elements hidden by z-index or opacity) left over from previous iterations. These cause unnecessary paint/layout work.
**Action:** Inspect overlapping elements in DevTools or code structure to remove invisible redundant layers.
