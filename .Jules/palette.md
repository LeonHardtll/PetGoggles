## 2024-05-22 - Auto-animating Slider Accessibility
**Learning:** Auto-animating interactive components (like sliders) must pause their animation loop when they receive keyboard focus (`onFocus`) as well as mouse hover. This ensures keyboard users maintain control and aren't fighting the animation.
**Action:** Always include `isFocused` state in the dependency array of the animation `useEffect` and attach `onFocus`/`onBlur` handlers to the interactive element.
