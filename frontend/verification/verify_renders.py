import time
from playwright.sync_api import sync_playwright

def verify_renders():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Capture console logs
        logs = []
        page.on("console", lambda msg: logs.append(msg.text))

        # Navigate to the app
        page.set_viewport_size({"width": 1280, "height": 800})

        try:
            page.goto("http://localhost:5173", timeout=60000)
            selector = "text=Drag slider to compare"
            page.wait_for_selector(selector, timeout=30000)

            # Get element bounding box
            box = page.locator(selector).bounding_box()
            if box:
                cx = box['x'] + box['width'] / 2
                cy = box['y'] + box['height'] / 2

                print("Moving mouse...")
                # Move mouse back and forth
                for i in range(20):
                    page.mouse.move(cx + (i % 2 * 100 - 50), cy)
                    time.sleep(0.05)

            render_count = len([l for l in logs if "HeroComparison rendered" in l])
            print(f"Total render count after mouse movement: {render_count}")

            if render_count > 20:
                print("Confirmed: Excessive re-renders on interaction.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_renders()
