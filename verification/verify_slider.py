import asyncio
from playwright.async_api import async_playwright
import re

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1280, "height": 800})

        try:
            print("Navigating...")
            await page.goto("http://localhost:5173", timeout=60000)

            handle_selector = "div.w-1.cursor-col-resize"
            container_selector = "div.rounded-3xl.cursor-col-resize"

            handle = page.locator(handle_selector).first
            container = page.locator(container_selector).first

            await handle.wait_for(timeout=10000)
            print("Slider handle found.")

            print("Checking auto-animation...")
            styles = []
            for _ in range(10):
                style = await handle.get_attribute("style")
                styles.append(style)
                await asyncio.sleep(0.05)

            print(f"Styles captured: {styles}")

            unique_styles = set(styles)
            if len(unique_styles) < 2:
                print("FAIL: Slider style did not change over time.")
            else:
                print("PASS: Slider is animating.")

            print("Checking hover pause...")
            await container.hover(force=True)
            await asyncio.sleep(0.5)

            style_1 = await handle.get_attribute("style")
            await asyncio.sleep(0.5)
            style_2 = await handle.get_attribute("style")

            print(f"Hover styles: {style_1} vs {style_2}")

            if style_1 != style_2:
                print("FAIL: Slider moved while hovering.")
            else:
                print("PASS: Slider paused on hover.")

            print("Checking mouse drag/move...")
            box = await container.bounding_box()
            if box:
                target_x = box["x"] + (box["width"] * 0.2)
                target_y = box["y"] + (box["height"] * 0.5)

                await page.mouse.move(target_x, target_y)
                await asyncio.sleep(0.2)

                final_style = await handle.get_attribute("style")
                print(f"Moved to 20%, style: {final_style}")

                match = re.search(r"left:\s*([\d\.]+)%", final_style or "")
                if match:
                    val = float(match.group(1))
                    if 15 <= val <= 25:
                        print(f"PASS: Slider moved to ~20% ({val}%)")
                    else:
                        print(f"FAIL: Slider at {val}%, expected ~20%")
                else:
                    print("FAIL: Could not parse style.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/error.png")
            raise e
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
