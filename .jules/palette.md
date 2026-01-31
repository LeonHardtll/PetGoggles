## 2024-05-22 - Animation Pausing on Focus
**Learning:** Auto-animating components (like sliders) can be disorienting for keyboard users if they continue moving while focused. They must pause on focus, just like they do on hover.
**Action:** Always include `onFocus` and `onBlur` handlers that toggle a paused state (e.g., `isFocused`) for any auto-playing animation.
