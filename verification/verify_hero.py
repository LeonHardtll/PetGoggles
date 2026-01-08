
from playwright.sync_api import Page, expect, sync_playwright

def verify_hero_animation(page: Page):
    # Navigate to the app (assuming default Vite port)
    page.goto("http://localhost:5173/")

    # Wait for the HeroComparison component to be visible
    # We can look for the "HUMAN" label inside it
    human_label = page.get_by_text("HUMAN", exact=False).first
    expect(human_label).to_be_visible()

    # Locate the slider handle
    slider_handle = page.locator(".cursor-col-resize.z-20")
    expect(slider_handle).to_be_visible()

    # Check that the slider handle is moving?
    # It's hard to verify animation programmatically without waiting and checking position changes.
    # But we can verify it renders and has the correct initial styles.

    # Get initial style
    initial_style = slider_handle.get_attribute("style")
    print(f"Initial style: {initial_style}")

    # Wait a bit
    page.wait_for_timeout(200)

    # Get style again
    new_style = slider_handle.get_attribute("style")
    print(f"New style: {new_style}")

    # If animation is working, style should change (unless we are extremely unlucky and it returned to same spot, but it sweeps)
    # The current implementation uses state, so style attribute updates in DOM.
    # Our optimized implementation will also update style attribute in DOM.

    if initial_style == new_style:
        print("Warning: Slider did not move. Animation might be broken or paused.")
    else:
        print("Slider is moving.")

    # Screenshot
    page.screenshot(path="/home/jules/verification/hero_before.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_hero_animation(page)
        finally:
            browser.close()
