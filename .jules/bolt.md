# Bolt's Journal ⚡

## 2024-05-22 - [Initial Setup]
**Learning:** Initialized Bolt's performance journal.
**Action:** Record critical performance insights here.

## 2025-05-22 - [Redundant DOM Rendering]
**Learning:** Found multiple "abandoned" versions of a component rendering simultaneously with `absolute` positioning. React rendered all of them, but z-index hid the old ones.
**Action:** Always check for "ghost" components in complex UI overlays.
