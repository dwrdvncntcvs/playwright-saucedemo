import { Locator, Page } from "@playwright/test";
import MainPage from "./MainPage";

export default class CheckoutOverview extends MainPage {
    finishBtn: Locator;
    subtotal: Locator;

    constructor(page: Page) {
        super(page, "/checkout-step-two.html");
        this.finishBtn = this.page.locator("#finish");
        this.subtotal = this.page.locator("[data-test='subtotal-label']");
    }
}
