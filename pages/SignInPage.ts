import type { Locator, Page } from "@playwright/test";
import { SignInFormFields } from "../types/sign-in.page";

export default class SignInPage {
    username: Locator;
    password: Locator;
    loginBtn: Locator;

    constructor(private page: Page) {
        this.username = this.page.locator("#user-name");
        this.password = this.page.locator("#password");
        this.loginBtn = this.page.locator("#login-button");
    }

    async navigate() {
        await this.page.goto("/");
    }

    async fillFields(data: Partial<SignInFormFields>) {
        for (let key of Object.keys(data)) {
            const _key = key as keyof SignInFormFields;
            if (data[_key]) {
                await this[_key].fill(data[_key]);
            }
        }
    }

    async error(message: string = "") {
        const errorEl = this.page.getByRole("heading", {
            name: `Epic sadface: ${message}`,
        });

        const closeBtn = errorEl.locator("[data-test='error-button']");

        return [errorEl, closeBtn];
    }

    async submit() {
        await this.loginBtn.click();
    }
}
