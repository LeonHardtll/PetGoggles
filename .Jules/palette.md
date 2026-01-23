## 2025-05-15 - Custom Slider Accessibility
**Learning:** Custom slider components (using `div`s for styling) must manually implement `role='slider'`, `tabIndex={0}`, `aria-valuenow`, and `onKeyDown` handlers for Arrow keys to be accessible.
**Action:** Always verify keyboard interaction and screen reader attributes when building or refactoring custom interactive components.

## 2025-05-15 - Code Cleanup
**Learning:** The `HeroComparison` component contained triplicate implementations of the overlay layer (possibly from failed merges or experiments).
**Action:** When refactoring, look for and remove phantom/duplicate code blocks to improve maintainability.
