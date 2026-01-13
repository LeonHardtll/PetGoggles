# Palette's Journal

## 2025-01-20 - [Focus Rings on Child Elements]
**Learning:** To render focus rings on a specific child element (like a slider handle) when a parent/wrapper container receives keyboard focus, use the `group` class on the parent and `group-focus-visible:` utilities on the child. This is useful for accessible custom controls where the focusable area is larger or different from the visual indicator.
**Action:** Use `group` on the focusable wrapper and `group-focus-visible:ring-*` on the visual child.
