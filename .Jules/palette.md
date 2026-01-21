## 2024-05-23 - Custom Interactive Components & Accessibility
**Learning:** Custom "hero" components (like comparison sliders) are often built with only mouse interactions in mind, completely missing keyboard support and ARIA roles.
**Action:** When auditing a new codebase, check the most visually "impressive" component first - it's likely the least accessible. Ensure `role`, `tabIndex`, and keyboard handlers are present.
