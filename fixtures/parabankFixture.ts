import { test as base, Page } from "@playwright/test";

type ParabankFixtures = {
  page: Page;
};

export const test = base.extend<ParabankFixtures>({
  page: async ({ page }, use) => {
    await page.goto("/");
    await use(page);
  },
});

export { expect } from "@playwright/test";
