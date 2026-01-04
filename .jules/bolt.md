## 2024-05-24 - Optimized HeroComparison Slider
**Learning:** High-frequency UI updates (like drag sliders) driven by React state (`useState`) cause excessive re-renders (60+ FPS), blocking the main thread.
**Action:** Move high-frequency state to `useRef` and use direct DOM manipulation (`element.style.width`) combined with `requestAnimationFrame` for smooth, performant interactions.
