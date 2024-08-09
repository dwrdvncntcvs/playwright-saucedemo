import { test as base, expect } from "@playwright/test";
import {
    ProductPage,
    SignInPage,
    CartPage,
    CheckoutOverviewPage,
    CheckoutPage,
} from "../pages";

const test = base.extend<{
    signIn: SignInPage;
    product: ProductPage;
    cart: CartPage;
    checkout: CheckoutPage;
    checkoutOverview: CheckoutOverviewPage;
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
    checkout: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    checkoutOverview: async ({ page }, use) => {
        await use(new CheckoutOverviewPage(page));
    },
});

export { test, expect };
