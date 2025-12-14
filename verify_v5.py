from playwright.sync_api import sync_playwright

def verify_v5():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3003")

        # Bypass Onboarding
        try:
            if page.is_visible('input[placeholder="Enter Company Name"]'):
                print("Onboarding found.")
                page.fill('input[placeholder="Enter Company Name"]', "RichCorp")
                page.click('button:has-text("Start Business")')
                page.wait_for_timeout(1000)
            else:
                 print("Onboarding skipped.")
        except:
             pass

        # 1. Check Initial Money
        print("Checking Money Logic...")
        # Money is in .status-value.money
        # Format "$500,000" -> remove $ and ,
        money_text = page.locator('.status-value.money').inner_text()
        initial_money = int(money_text.replace('$','').replace(',',''))
        print(f"Initial Money: {initial_money}")

        # 2. Manufacture an Item
        page.click('button:has-text("Factory")')
        page.wait_for_timeout(500)

        # Select Camera Line
        page.click('button.option-card.huge >> nth=0')
        page.click('button:has-text("Next")')

        # Config (Defaults are fine)
        page.click('button:has-text("Next: Components")')

        # Components (Defaults)
        page.click('button:has-text("Next: Review & Build")')

        # Build Step - Check Cost Display
        # We need to find the cost. It is in <p>Total Cost: $X</p>
        cost_text = page.locator('.quantity-control p').inner_text()
        # "Total Cost: $12,500" -> 12500
        cost_val = int(cost_text.split('$')[1].replace(',',''))
        print(f"Projected Cost: {cost_val}")

        # Click Start
        page.click('button:has-text("Start Production")')
        page.wait_for_timeout(500)

        # 3. Check Money Deduction
        new_money_text = page.locator('.status-value.money').inner_text()
        new_money = int(new_money_text.replace('$','').replace(',',''))
        print(f"New Money: {new_money}")

        if initial_money - new_money == cost_val:
            print("Verified: Money correctly deducted.")
        else:
            print(f"Failed: Money diff is {initial_money - new_money}, expected {cost_val}")

        browser.close()

if __name__ == "__main__":
    verify_v5()
