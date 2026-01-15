## 2024-05-21 - Custom Sliders require Manual A11y
**Learning:** Custom interactive components like "before/after" sliders are often built with just `div`s and mouse events, completely excluding keyboard users and screen readers.
**Action:** Always implement `role="slider"`, `tabIndex={0}`, standard ARIA range attributes, and `onKeyDown` handlers (Arrows/Home/End) when building custom range inputs.
