## 2026-01-18 - Accessible File Inputs
**Learning:** Using `display: none` (Tailwind `.hidden`) on file inputs makes them inaccessible to keyboard users.
**Action:** Use `.sr-only` instead of `.hidden` for inputs, and apply `focus-within` styles to the wrapping label to ensure focus visibility.
