## 2024-05-20 - [Optimizing Interactive Components]
**Learning:** High-frequency animations (like sliders) cause massive performance degradation if they rely on React state updates (re-renders).
**Action:** Use 'useRef' for values and direct DOM manipulation via 'ref.current.style' for smooth 60fps animations.

## 2024-05-20 - [Auto-Animation Performance]
**Learning:** 'setInterval' for animations is choppy and frame-unaligned.
**Action:** Use 'requestAnimationFrame' with time-delta calculations (capped) to decouple animation speed from frame rate and ensure smoothness.
