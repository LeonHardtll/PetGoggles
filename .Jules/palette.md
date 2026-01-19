# Palette's Journal

## 2024-05-21 - Accessible Auto-Animation
**Learning:** Auto-animating components (like sliders) must pause on keyboard focus, not just hover. Users navigating via keyboard need a stable state to interact with.
**Action:** When using `setInterval` for animations, always include `isFocused` state (tracked via `onFocus`/`onBlur`) in the pause condition.
