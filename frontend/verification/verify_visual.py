from playwright.sync_api import sync_playwright

def verify_visual():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})

        try:
            page.goto("http://localhost:5173", timeout=60000)
            selector = "text=Drag slider to compare"
            page.wait_for_selector(selector, timeout=30000)

            # Scroll to component
            page.locator(selector).scroll_into_view_if_needed()

            # Screenshot 1: Default state
            page.screenshot(path="frontend/verification/hero_default.png")
            print("Screenshot saved: frontend/verification/hero_default.png")

            # Hover over the component
            box = page.locator(selector).bounding_box()
            if box:
                # Hover over the container (above the text)
                page.mouse.move(box['x'] + box['width'] / 2, box['y'] - 100)
                page.wait_for_timeout(500)
                page.screenshot(path="frontend/verification/hero_hover.png")
                print("Screenshot saved: frontend/verification/hero_hover.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_visual()
