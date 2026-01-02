## 2024-05-24 - Interactive Cards Accessibility
**Learning:** Interactive `div` components (like Cards used as buttons) are invisible to keyboard users and screen readers unless explicitly given `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers.
**Action:** When making a non-button element interactive, always add:
1. `role="button"`
2. `tabIndex={0}`
3. `onKeyDown` for Enter/Space
4. `aria-pressed` or `aria-selected` if stateful.

## 2024-05-24 - File Input Accessibility
**Learning:** Using `display: none` (Tailwind `hidden`) on file inputs removes them from the accessibility tree.
**Action:** Use `sr-only` class on the input and `focus-within` styles on the wrapper label to maintain accessibility while preserving custom UI.
