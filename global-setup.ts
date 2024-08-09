import { chromium, type FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
    console.log("Running Global Set up");
    const { baseURL, storageState } = config.projects[0].use;

    const browsers = await chromium.launch();
    const ctx = await browsers.newContext();
    const page = await ctx.newPage();

    await page.goto(baseURL!);

    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "LOGIN" }).click();

    await page.context().storageState({ path: "./state.json" });
    await browsers.close();
}
