# Bolt's Journal ⚡

## 2024-05-22 - High-Frequency Animation Performance
**Learning:** Using `useState` and `setInterval` for high-frequency animations (like auto-sweeping sliders or drag interactions) forces a React re-render on every frame (~16ms). This consumes main thread time unnecessarily.
**Action:** For purely visual, high-frequency updates that don't affect other component logic, use `useRef` to track state and `requestAnimationFrame` with direct DOM manipulation. This bypasses the React render cycle entirely, keeping the UI silky smooth at 60fps.
