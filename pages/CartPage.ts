import { Locator, Page } from "@playwright/test";
import MainPage from "./MainPage";

export default class CartPage extends MainPage {
    checkoutBtn: Locator;

    constructor(page: Page) {
        super(page, "/cart.html");
        this.checkoutBtn = this.page.locator("#checkout");
    }

    async items() {
        return await this.page.locator("[data-test='inventory-item']").all();
    }

    async getSubTotalFromItems(): Promise<number> {
        const items = await this.items();

        const amounts: number[] = [];
        for (let item of items) {
            const price = await item
                .locator("[data-test='inventory-item-price']")
                .innerText();
            amounts.push(Number(price.replace("$", "")));
        }

        return amounts.reduce((acc, curr) => (acc += curr), 0);
    }
}
