import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:5173")

            # Wait for component to load
            print("Waiting for slider...")
            # Target the handle explicitly using unique classes
            handle_selector = "div.cursor-col-resize.z-20"
            page.wait_for_selector(handle_selector, timeout=5000)

            handle = page.locator(handle_selector).first
            # Container is the parent of the handle's wrapper?
            # Actually handle is direct child of container in the JSX:
            # <div ref={containerRef} ...> ... <div ... handle ...> </div>
            container = handle.locator("..")

            # 1. Verify Auto-Sweep
            print("Verifying Auto-Sweep...")
            # Ensure we are NOT hovering
            page.mouse.move(0, 0)

            time.sleep(0.5) # Wait for potential initial stabilize

            initial_left = get_left_percentage(handle)
            print(f"Initial left: {initial_left}")

            time.sleep(0.5)

            next_left = get_left_percentage(handle)
            print(f"Next left: {next_left}")

            if initial_left == next_left:
                print("❌ Slider did not move automatically.")
                exit(1)
            else:
                print("✅ Slider moved automatically.")

            # 2. Verify Pause on Hover
            print("Verifying Pause on Hover...")
            # Hover over the container center
            box = container.bounding_box()
            center_x = box["x"] + box["width"] / 2
            center_y = box["y"] + box["height"] / 2

            page.mouse.move(center_x, center_y)
            # Wait for hover to register
            time.sleep(0.2)

            paused_left_1 = get_left_percentage(handle)
            time.sleep(0.5)
            paused_left_2 = get_left_percentage(handle)

            # Note: hovering also triggers handleMouseMove which sets position to cursor.
            # So the position should be fixed to where the mouse IS.
            # If I don't move the mouse, the slider should stay at the mouse position.
            # And the auto-sweep should be paused.

            if abs(paused_left_1 - paused_left_2) > 0.1:
                 print(f"❌ Slider moved while hovering (unstable). {paused_left_1} -> {paused_left_2}")
                 exit(1)
            else:
                 print("✅ Slider stable on hover.")

            # 3. Verify Drag / Follow Mouse
            print("Verifying Mouse Follow...")
            # Move mouse to 75% width
            target_x = box["x"] + box["width"] * 0.75
            page.mouse.move(target_x, center_y)
            time.sleep(0.1)

            final_left = get_left_percentage(handle)
            print(f"Target approx 75%, Got: {final_left}")

            if abs(final_left - 75) > 5:
                 print("❌ Slider did not follow mouse correctly.")
                 exit(1)
            else:
                 print("✅ Slider followed mouse.")

            # Take a screenshot for verification
            print("Taking screenshot...")
            page.screenshot(path="frontend/verification/verification.png")
            print("Screenshot saved to frontend/verification/verification.png")

            print("All checks passed.")
        except Exception as e:
            print(f"Error: {e}")
            exit(1)
        finally:
            browser.close()

def get_left_percentage(locator):
    style = locator.get_attribute("style")
    print(f"DEBUG: style='{style}'")
    # style is like "left: 50%;"
    # extract number
    try:
        parts = style.split("left:")[1].split("%")[0]
        return float(parts.strip())
    except:
        return -1

if __name__ == "__main__":
    run()
