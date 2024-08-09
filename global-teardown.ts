import { chromium, type FullConfig } from "@playwright/test";

export default async function globalTeardown(config: FullConfig) {
    const { baseURL } = config.projects[0].use;

    const browser = await chromium.launch();
    const ctx = await browser.newContext({ storageState: "./state.json" });
    const page = await ctx.newPage();

    await page.goto(baseURL! + "/inventory.html");
    await page.locator("#react-burger-menu-btn").click();
    await page.locator("#reset_sidebar_link").click();
    await page.locator("#logout_sidebar_link").click();

    await browser.close();
}
