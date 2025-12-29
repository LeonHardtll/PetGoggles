## 2024-05-22 - Interactive Cards vs Semantic Buttons
**Learning:** This project uses `Card` components (divs) for primary mode selection without accessibility attributes, blocking keyboard users.
**Action:** When identifying interactive cards, immediately add `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers if converting to a semantic `<button>` isn't feasible due to styling constraints.
