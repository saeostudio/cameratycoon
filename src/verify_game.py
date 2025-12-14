from playwright.sync_api import sync_playwright

def verify_onboarding(page):
    # 1. Start App
    page.goto('http://localhost:3000')

    # 2. Check for Onboarding Screen
    page.wait_for_selector('text=Welcome, CEO!')

    # 3. Enter details
    page.fill('input[placeholder="Enter Company Name"]', 'Future Optics')

    # 4. Click a logo (camera emoji)
    page.click('text=📷')

    # 5. Submit
    page.click('button:has-text("Start Business")')

    # 6. Verify Main UI Load (Top Bar presence)
    page.wait_for_selector('header.top-bar')
    page.wait_for_selector('text=Future Optics')

    # 7. Screenshot Main UI
    page.screenshot(path='/home/jules/verification/onboarding_complete.png')

    # 8. Check Bottom Nav
    page.click('button:has-text("Lab")')
    page.screenshot(path='/home/jules/verification/lab_view.png')

def verify_lab_tech(page):
    # Check Tech Tree constraints in Lab
    # Try to make a sensor
    page.click('button:has-text("Sensor")')

    # Check that Medium Format is disabled/locked
    # We can check if the option is disabled or text contains 'Locked'
    page.wait_for_selector('option:has-text("Medium Format (Locked)")')

    # Screenshot Lab
    page.screenshot(path='/home/jules/verification/lab_locked.png')

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a persistent context so local storage might work?
        # Actually standard new_page is fine for single session flow.
        context = browser.new_context()
        page = context.new_page()

        try:
            verify_onboarding(page)
            verify_lab_tech(page)
            print("Verification script ran successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path='/home/jules/verification/error.png')
        finally:
            browser.close()
