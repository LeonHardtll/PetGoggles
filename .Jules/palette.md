# Palette's Journal

## 2024-05-23 - Interactive Cards Accessibility
**Learning:** Interactive cards (divs) are a common pattern in this app but often lack keyboard accessibility, creating a barrier for keyboard-only users.
**Action:** When identifying clickable cards, always add `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers for Enter/Space, along with visible focus states.
