## 2024-05-21 - Accessible File Inputs
**Learning:** Standard `input[type="file"]` elements hidden with `display: none` (Tailwind `hidden`) are inaccessible to keyboard users because they cannot receive focus.
**Action:** Use `sr-only` on the input to keep it in the DOM but visually hidden, and add `focus-within` styles to the parent label to provide a visual focus indicator.
