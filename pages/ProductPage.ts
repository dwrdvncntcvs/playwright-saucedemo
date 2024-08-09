import { Locator, Page } from "@playwright/test";
import MainPage from "./MainPage";

export default class ProductPage extends MainPage {
    constructor(page: Page) {
        super(page, "/inventory.html");
    }

    async addToCart() {
        const item_1 = this.page.locator(
            "#add-to-cart-sauce-labs-fleece-jacket"
        );

        await item_1.click();

        const all_items = await this.page
            .locator("button[id*='add-to-cart-']")
            .all();

        const exclude = ["add-to-cart-sauce-labs-fleece-jacket"];

        const filteredItems: Locator[] = [];

        for (let item of all_items) {
            const id = await item.getAttribute("id");
            if (!exclude.includes(id!)) {
                filteredItems.push(item);
            }
        }

        if (filteredItems.length === 0) return;

        const index = Math.floor(Math.random() * filteredItems.length);
        const item_2 = filteredItems[index];

        await item_2.click();
    }
}
