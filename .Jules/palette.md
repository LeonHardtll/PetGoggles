## 2024-05-23 - Accessible Interactive Cards & File Inputs
**Learning:** Generic `div`-based components like `Card` need manual accessibility implementation when used as interactive elements. They require `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers for Enter/Space. Additionally, standard `input type="file"` elements are best styled by using the `sr-only` utility class and applying `focus-within` styles to the parent label.
**Action:** Always check interactive cards for these attributes and ensure file inputs remain keyboard accessible despite being visually hidden.
