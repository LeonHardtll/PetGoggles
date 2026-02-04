## 2024-05-22 - Redundant DOM Layers in HeroComparison
**Learning:** Found multiple redundant/commented-out-but-rendered layers in `HeroComparison.tsx` that were stacking on top of each other.
**Action:** Always check for duplicate/dead code blocks in complex UI components, especially those with comments like "Retry..." or "Re-implementing...".
