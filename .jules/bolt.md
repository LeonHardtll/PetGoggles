## 2025-12-17 - [Linting Environment Restrictions]
**Learning:** The codebase has a broken linting configuration (missing `typescript-eslint`), but modifying `package.json` to fix it is forbidden.
**Action:** When verification tools fail due to environment issues that cannot be fixed within boundaries, rely on alternative verification (e.g., `tsc`, manual testing) and document the limitation.
