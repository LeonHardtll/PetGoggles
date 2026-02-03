## 2025-05-20 - Custom Slider Accessibility
**Learning:** Custom interactive sliders often use auto-animation (sweeping) to attract attention. This animation MUST pause not only on hover but also on keyboard focus (WCAG 2.2.2). Additionally, implementing Arrow key handlers requires `e.preventDefault()` to stop the page from scrolling while operating the slider.
**Action:** When building custom sliders, always include `isFocused` state to pause animations and call `preventDefault()` in keyboard handlers.
