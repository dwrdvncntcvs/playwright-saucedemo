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
}
