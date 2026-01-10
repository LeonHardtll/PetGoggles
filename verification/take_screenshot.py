
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Set viewport to capture the component
        await page.set_viewport_size({"width": 1280, "height": 800})

        try:
            print("Navigating to app...")
            await page.goto("http://localhost:5173", timeout=60000)

            # Wait for slider to appear
            handle = page.locator("div.w-1.cursor-col-resize").first
            await handle.wait_for(timeout=10000)

            # Take screenshot of the slider area
            # We can capture the container if we find it
            container = page.locator("div.rounded-3xl.cursor-col-resize").first

            # Wait a moment for animation to happen
            await asyncio.sleep(0.5)

            print("Taking screenshot...")
            await container.screenshot(path="/home/jules/verification/slider_screenshot.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="/home/jules/verification/error_screenshot.png")
            raise e
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
