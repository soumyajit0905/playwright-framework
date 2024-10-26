import { test, expect } from "../fixtures/parabankFixture";

test.describe("Page Load State Validations", () => {
  test('Validate "load" state with default timeout', async ({ page }) => {
    await page.goto("/parabank/index.htm");
    await page.waitForLoadState("load");
    const title = await page.title();
    expect(title).toContain("ParaBank");
  });

  test('Validate "domcontentloaded" state', async ({ page }) => {
    await page.goto("/parabank/services.htm");
    await page.waitForLoadState("domcontentloaded"); // Waits for 'DOMContentLoaded' event
    const title = await page.title();
    expect(title).toContain("ParaBank | Services");
  });

  //test('Validate "networkidle" state with custom timeout', async ({ page }) => {
  //  await page.goto("/parabank/about.htm");
  //  await page.waitForLoadState("networkidle", { timeout: 10000 }); // Waits until there are no active network requests
  //  const heading = await page.textContent("h1");
  //  expect(heading).toContain("About Us");
  //});

  test("Handle popup with waitForLoadState()", async ({ page }) => {
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.click('a[target="_blank"]'), // Link that opens in a new tab
    ]);
    await popup.waitForLoadState("domcontentloaded"); // Ensures popup content is loaded
    expect(await popup.title()).toBe(
      "Automated Testing to Deliver Superior Quality Software | Parasoft"
    );
  });

  // Utility function to generate random string
  function generateRandomString(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  test("Custom waitForLoadState() in registration scenario", async ({
    page,
  }) => {
    await page.goto("/parabank/register.htm");

    await page.waitForLoadState("domcontentloaded");

    // Generating random values for first name and last name
    const firstName = "John" + generateRandomString(5);
    const lastName = "Doe" + generateRandomString(5);

    await page.locator("input[id='customer.firstName']").fill(firstName);
    await page.locator("input[id='customer.lastName']").fill(lastName);
    await page.locator("input[id='customer.address.street']").fill("123 Elm St");
    await page.locator("input[id='customer.address.city']").fill("Springfield");
    await page.locator("input[id='customer.address.state']").fill("IL");
    await page.locator("input[id='customer.address.zipCode']").fill("62701");
    await page.locator("input[id='customer.phoneNumber']").fill("1234567890");
    await page.locator("input[id='customer.ssn']").fill(generateRandomString(9));
    await page.locator("input[id='customer.username']").fill(firstName); // Use firstName as username to ensure uniqueness
    await page.locator("input[id='customer.password']").fill("password123");
    await page.locator("input[id='repeatedPassword']").fill("password123");
    await page.click('input[value="Register"]');

    // Validate next page load after clicking register
    await page.waitForLoadState("load");
    const successMessage = await page.textContent(".title");
    expect(successMessage).toContain("Welcome");
    const text = await page.locator("h1[class=title] + p");
    await expect(text).toHaveText(
      "Your account was created successfully. You are now logged in."
    );
  });
});
