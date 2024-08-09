import { test as base, expect } from "@playwright/test";
import { ProductPage, SignInPage, CartPage } from "../pages";

const test = base.extend<{
    signIn: SignInPage;
    product: ProductPage;
    cart: CartPage;
}>({
    signIn: async ({ page }, use) => {
        await use(new SignInPage(page));
    },
    product: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cart: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});

export { test, expect };
