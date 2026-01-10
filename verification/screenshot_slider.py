
import os
import sys
import time
from playwright.sync_api import sync_playwright, expect

def screenshot_slider():
    print("Starting screenshot verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set viewport to something reasonable
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        try:
            page.goto("http://localhost:5173", timeout=10000)

            # Find the slider handle
            slider_handle = page.locator("[role='slider']").first
            slider_handle.wait_for(state="visible", timeout=5000)

            # Focus it to show focus ring (if any)
            slider_handle.focus()

            # Take a screenshot
            screenshot_path = "/home/jules/verification/slider_focus.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Screenshot failed with error: {e}")
            sys.exit(1)

        browser.close()

if __name__ == "__main__":
    screenshot_slider()
