from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3003")

        # Bypass Onboarding if present
        try:
            if page.is_visible('input[placeholder="Enter Company Name"]'):
                print("Onboarding found.")
                page.fill('input[placeholder="Enter Company Name"]', "TestCorp")
                page.click('button:has-text("Start Business")')
                page.wait_for_timeout(1000)
            else:
                 print("Onboarding skipped or not present.")
        except Exception as e:
            print(f"Onboarding step error: {e}")

        # 1. Verify Lab - Film Color Mode Toggle
        print("Verifying Lab changes...")
        # Check if we are already in Lab (default view) or need to click
        if page.is_visible('button:has-text("Lab")'):
             page.click('button:has-text("Lab")')
        else:
             print("Could not find Lab button, assuming we are in Lab or looking at something else.")
        page.wait_for_timeout(1000)
        page.click('button:has-text("Film")')
        page.wait_for_timeout(1000)

        # Check if Color/B&W radio buttons exist
        if page.is_visible('input[type="radio"] >> nth=0') and page.is_visible('input[type="radio"] >> nth=1'):
            print("Verified: Color/B&W Toggles present.")
        else:
            print("Failed: Toggles not found.")
            exit(1)

        # 2. Verify Factory - Quantity Slider
        print("Verifying Factory changes...")
        # Create a film design first to produce it
        page.fill('input[value=""]', "Test Film")
        page.click('button:has-text("Develop Film")')
        page.wait_for_timeout(1000)

        page.click('button:has-text("Factory")')
        page.wait_for_timeout(1000)

        # Step 1: Select Film Line
        page.click('button:has-text("Film")') # Click Film Icon Card
        page.wait_for_timeout(500)
        page.click('button:has-text("Next")')

        # Step 2: Select Design
        page.wait_for_timeout(1000)
        page.click('button.mini-card >> nth=0') # Select the first design
        page.click('button:has-text("Next: Manufacture")')

        # Step 3: Quantity Slider
        page.wait_for_timeout(1000)
        if page.is_visible('.quantity-control'):
            print("Verified: Quantity control present.")
            # Check default value
            val = page.locator('input[type="range"]').input_value()
            print(f"Default Quantity: {val}")

            # Change value
            page.fill('input[type="range"]', '500')
            new_val = page.locator('input[type="range"]').input_value()
            print(f"New Quantity: {new_val}")

            # Check Cost Update (manual check via text)
            cost_text = page.locator('.quantity-control p').inner_text()
            print(f"Cost Display: {cost_text}")

        else:
            print("Failed: Quantity control not found.")
            exit(1)

        # Take verification screenshot
        page.screenshot(path='/home/jules/verification/v3_verification.png')
        print("Screenshot saved.")

        browser.close()

if __name__ == "__main__":
    verify_changes()
