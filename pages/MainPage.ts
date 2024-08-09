import { Locator, Page } from "@playwright/test";

export default class MainPage {
    navigationBtn: Locator;
    cartLink: Locator;
    title: Locator;
    cartBadge: Locator;

    constructor(protected page: Page, public url: string) {
        this.navigationBtn = this.page.locator("#react-burger-menu-btn");
        this.cartLink = this.page.locator("[data-test='shopping-cart-link']");
        this.title = this.page.locator("[data-test='title']");
        this.cartBadge = this.page.locator("[data-test='shopping-cart-badge']");
    }

    async waitUrl() {
        await this.page.waitForURL(this.url);
    }

    async resetState() {
        await this.navigationBtn.click();

        await this.page.locator("#reset_sidebar_link").click();
    }
}
