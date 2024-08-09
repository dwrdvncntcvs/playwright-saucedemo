import { Locator, Page } from "@playwright/test";
import MainPage from "./MainPage";

export default class CheckoutCompletePage extends MainPage {
    message: Locator;
    backHomeBtn: Locator;

    constructor(page: Page) {
        super(page, "/checkout-complete.html");
        this.message = this.page.locator("[data-test='complete-header']");
        this.backHomeBtn = this.page.locator("#back-to-products");
    }
}
