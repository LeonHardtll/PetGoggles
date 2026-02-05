# Palette's Journal

This journal records CRITICAL learnings about UX and accessibility specific to this project.
Entries focus on patterns, rejected changes with constraints, and surprising user behaviors.

## 2024-05-23 - Initial Setup
**Learning:** Project initialized with high focus on visual polish but gaps in accessibility (ARIA, keyboard nav).
**Action:** Systematically audit high-traffic components (Testimonials, Hero) for missing semantic structure.

## 2024-05-23 - Visual Ratings Accessibility
**Learning:** Visual rating components (stars) without ARIA labels are completely invisible to screen readers.
**Action:** Always wrap visual ratings in a container with role="img" and aria-label="X out of Y stars", and hide individual icons with aria-hidden="true".
