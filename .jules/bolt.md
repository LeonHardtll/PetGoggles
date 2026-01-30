## 2025-02-21 - Frontend Tooling & Performance
**Learning:** The frontend ESLint configuration uses the new Flat Config (`eslint.config.js`) but `package.json` is missing the required dependencies (`@eslint/js`, `typescript-eslint`, `globals`), causing `pnpm lint` to fail.
**Action:** Reliance on `pnpm build` (tsc) is necessary for verification until dependencies are fixed.
