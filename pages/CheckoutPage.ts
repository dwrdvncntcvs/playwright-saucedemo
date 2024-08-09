import { Locator, Page } from "@playwright/test";
import MainPage from "./MainPage";

interface InfoFields {
    firstName: string;
    lastName: string;
    postalCode: string;
}

export default class CheckoutPage extends MainPage {
    firstName: Locator;
    lastName: Locator;
    postalCode: Locator;
    continueBtn: Locator;

    constructor(page: Page) {
        super(page, "/checkout-step-one.html");
        this.firstName = this.page.locator("#first-name");
        this.lastName = this.page.locator("#last-name");
        this.postalCode = this.page.locator("#postal-code");
        this.continueBtn = this.page.locator("#continue");
    }

    async fillInfoFields(data: Partial<InfoFields>) {
        for (let key of Object.keys(data)) {
            const _key = key as keyof InfoFields;
            if (key) await this[_key].fill(data[key]);
        }
    }

    async error(message: string = "") {
        const errorEl = this.page.getByRole("heading", {
            name: `Error: ${message}`,
        });

        const closeBtn = errorEl.locator("[data-test='error-button']");

        return [errorEl, closeBtn];
    }
}
