## 2024-05-22 - Accessible Custom Slider
**Learning:** Custom slider components require `role="slider"`, `tabIndex={0}`, and `aria-valuenow` to be accessible. Keyboard support must include Arrow keys (Left/Right/Up/Down) and Home/End. Animation should pause on focus.
**Action:** Use `onKeyDown` for keyboard support and `onFocus`/`onBlur` to manage animation state.
