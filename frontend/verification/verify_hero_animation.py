import time
from playwright.sync_api import sync_playwright

def verify_animation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use large viewport
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        try:
            page.goto("http://localhost:5173")
            # Wait for load and animation start
            time.sleep(3)

            # Locate container
            locator = page.locator("div.aspect-\\[3\\/4\\]")
            count = locator.count()
            print(f"Found {count} containers")

            container = None
            for i in range(count):
                el = locator.nth(i)
                if el.is_visible():
                    container = el
                    break

            if not container:
                print("No visible container found")
                return

            print("Found visible container")
            handle = container.locator("div.z-20")

            # 1. Animation Check
            initial_style = handle.get_attribute("style")
            print(f"Initial: {initial_style}")
            time.sleep(0.5)
            new_style = handle.get_attribute("style")
            print(f"New: {new_style}")

            if initial_style != new_style:
                print("SUCCESS: Slider is animating.")
            else:
                print("FAILURE: Slider is NOT animating.")

            # 2. Hover Check (Pause)
            print("Hovering...")
            container.hover()
            time.sleep(0.5)
            paused_1 = handle.get_attribute("style")
            time.sleep(0.5)
            paused_2 = handle.get_attribute("style")

            if paused_1 == paused_2:
                 print("SUCCESS: Animation paused on hover.")
            else:
                 print(f"FAILURE: Animation continued on hover: {paused_1} -> {paused_2}")

            # 3. Drag Check
            print("Dragging...")
            box = container.bounding_box()
            center_x = box['x'] + box['width'] / 2
            center_y = box['y'] + box['height'] / 2

            page.mouse.move(center_x, center_y)
            page.mouse.down()
            page.mouse.move(center_x + 50, center_y)
            page.mouse.up()

            time.sleep(0.1)
            dragged_style = handle.get_attribute("style")
            print(f"Dragged style: {dragged_style}")

            page.screenshot(path="frontend/verification/verification.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_animation()
