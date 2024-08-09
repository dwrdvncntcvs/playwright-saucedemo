import { Locator, Page } from "@playwright/test";
import MainPage from "./MainPage";

const DEFAULT_SELECTED_PRODUCT_ID = "sauce-labs-fleece-jacket";

export default class ProductPage extends MainPage {
    constructor(page: Page) {
        super(page, "/inventory.html");
    }

    async addSpecificProduct() {
        await this.addProduct(DEFAULT_SELECTED_PRODUCT_ID);
    }

    async addProduct(name: string | "random") {
        if (name !== "random")
            await this.page.locator(`#add-to-cart-${name}`).click();
        else {
            const all_items = await this.page
                .locator("button[id*='add-to-cart-']")
                .all();

            const exclude = [`add-to-cart-${DEFAULT_SELECTED_PRODUCT_ID}`];

            const filteredItems: Locator[] = [];

            for (let item of all_items) {
                const id = await item.getAttribute("id");
                if (!exclude.includes(id!)) {
                    filteredItems.push(item);
                }
            }

            if (filteredItems.length === 0) return;

            const index = Math.floor(Math.random() * filteredItems.length);
            await filteredItems[index].click();
        }
    }
}
