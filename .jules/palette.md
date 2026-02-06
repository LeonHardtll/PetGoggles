## 2025-02-06 - Accessible Custom Sliders
**Learning:** Custom slider components often lack basic accessibility. Adding `role="slider"`, `tabIndex={0}`, and `aria-valuenow` is essential, but proper keyboard handling (`onKeyDown` for Arrow keys) is what actually makes them usable.
**Action:** When creating custom interactive widgets, always start by implementing the WAI-ARIA keyboard interaction pattern before styling.
