## BOLT'S JOURNAL - CRITICAL LEARNINGS ONLY

## 2024-05-22 - Broken Lint Configuration
**Learning:** The project uses ESLint 9+ flat config (`eslint.config.js`) but `package.json` only contains ESLint 8 and is missing required dependencies (`@eslint/js`, `typescript-eslint`).
**Action:** Do not rely on `pnpm lint`. Use `pnpm build` for type checking and manual verification. Do not attempt to fix `package.json` unless explicitly tasked.
