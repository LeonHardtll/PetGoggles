## 2024-05-23 - Interactive Div Pattern
**Learning:** `div`s with `onClick` (like Cards) are invisible to keyboard users.
**Action:** When making a `div` interactive, always add `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers for Enter/Space, plus visible focus styles.
