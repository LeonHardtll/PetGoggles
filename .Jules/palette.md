## 2025-02-27 - Accessible Interactive Cards
**Learning:** The `Card` component is a generic container (div) and lacks built-in accessibility for interactive states. Using it for selection requires manual addition of `role='button'`, `tabIndex={0}`, and `onKeyDown` handlers.
**Action:** Always check interactive 'cards' for keyboard accessibility and add `role='button'` and key handlers if they are just `div`s.
