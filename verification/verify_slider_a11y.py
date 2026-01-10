
import os
import sys
import time
from playwright.sync_api import sync_playwright, expect

def verify_slider_accessibility():
    print("Starting verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            page.goto("http://localhost:5173", timeout=10000)
        except Exception as e:
            print(f"Error connecting to localhost:5173: {e}")
            sys.exit(1)

        try:
            # The issue might be that there are multiple elements with .cursor-col-resize.
            # The container has it, and the handle has it.
            # We want the handle. The handle has role="slider" if my change applied.
            # But the container DOES NOT have role="slider".

            # Let's list all elements with cursor-col-resize
            locators = page.locator(".cursor-col-resize").all()
            print(f"Found {len(locators)} elements with .cursor-col-resize")

            slider_handle = None

            # Find the one that is supposed to be the handle (the one with the handle icon or explicit role if visible)
            # The handle is the second one in the source usually, but let's check attributes.

            for i, loc in enumerate(locators):
                role = loc.get_attribute("role")
                print(f"Element {i} role: {role}")
                if role == "slider":
                    slider_handle = loc
                    break

            if not slider_handle:
                print("Could not find element with role='slider' among .cursor-col-resize elements.")
                # Fallback: Maybe we pick the second one if my code didn't update hot reload?
                # Or maybe the first one is blocking?
                # Let's target the one with z-20 as per code
                slider_handle = page.locator(".cursor-col-resize.z-20").first

            print("Targeting slider handle...")
            role_attr = slider_handle.get_attribute("role")
            if role_attr != "slider":
                print(f"FAIL: Expected role='slider', found '{role_attr}'")
            else:
                print("PASS: role='slider' found.")

            tabindex = slider_handle.get_attribute("tabindex")
            if tabindex != "0":
                 print(f"FAIL: Expected tabindex='0', found '{tabindex}'")
            else:
                 print("PASS: tabindex='0' found.")

            if role_attr == "slider":
                slider_handle.focus()

                # Check if focused
                is_focused = slider_handle.evaluate("el => document.activeElement === el")
                print(f"Is focused: {is_focused}")

                initial_style = slider_handle.get_attribute("style")
                print(f"Initial style: {initial_style}")

                # We need to wait a bit because the auto-animation might still be running
                # if onFocus didn't work immediately or if we caught it in between.
                # However, onFocus should stop it.

                page.keyboard.press("ArrowRight")
                time.sleep(0.5)

                new_style = slider_handle.get_attribute("style")
                print(f"Style after ArrowRight: {new_style}")

                if initial_style != new_style:
                    print("PASS: Slider moved with ArrowRight.")
                else:
                    print("FAIL: Slider did not move with ArrowRight.")

        except Exception as e:
            print(f"Verification failed with error: {e}")

        browser.close()

if __name__ == "__main__":
    verify_slider_accessibility()
