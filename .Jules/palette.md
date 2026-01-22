## 2024-05-22 - Accessibility in Custom Sliders
**Learning:** Custom interactive components (like image comparison sliders) often neglect keyboard users, making them completely unusable for accessibility. Adding standard ARIA roles (`slider`) and keyboard handling (`ArrowKeys`) is a small change with massive impact.
**Action:** Always check `tabIndex` and keyboard handlers when implementing `onMouseMove` or drag interactions.
