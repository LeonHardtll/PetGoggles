## 2024-05-22 - React Manual DOM Manipulation
**Learning:** When optimizing high-frequency animations by moving from React state to direct DOM manipulation (via refs), simply updating the ref's style is not enough if the JSX still contains the initial style prop. React's reconciliation will overwrite manual updates on any re-render.
**Action:** Remove the dynamic style prop from the JSX entirely and use `useLayoutEffect` to set the initial state (and ensure sync after re-renders).

## 2024-05-22 - Playwright Locator Ambiguity
**Learning:** Using generic utility classes like `.cursor-col-resize` as locators can be dangerous if applied to both container and child elements.
**Action:** Always verify locators return the specific element intended, or use structural selectors (e.g. `div.w-1.bg-white.cursor-col-resize`).
