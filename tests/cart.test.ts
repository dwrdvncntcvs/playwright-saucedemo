import { Locator } from "@playwright/test";
import { test, expect } from ".";

const FIRST_NAME = "John",
    LAST_NAME = "Doe",
    POSTAL_CODE = "1234";

test.describe("Cart Page", () => {
    let cartItems: Locator[] = [];

    test.beforeEach(async ({ page, baseURL, product, cart }) => {
        await page.goto(product.url);
        await product.waitUrl();

        await expect(page).toHaveURL(`${baseURL!}${product.url}`);

        await product.addToCart();
        await product.cartLink.click();

        await cart.waitUrl();

        await expect(cart.title).toHaveText("Your Cart");

        cartItems = await cart.items();
    });

    [
        {
            name: "missing all fields",
            infoFields: { firstName: "", lastName: "", postalCode: "" },
            error: "First Name is required",
        },
        {
            name: "missing last name and postal code",
            infoFields: { firstName: FIRST_NAME, lastName: "", postalCode: "" },
            error: "Last Name is required",
        },
        {
            name: "missing postal code",
            infoFields: {
                firstName: FIRST_NAME,
                lastName: LAST_NAME,
                postalCode: "",
            },
            error: "Postal Code is required",
        },
        {
            name: "valid fields",
            infoFields: {
                firstName: FIRST_NAME,
                lastName: LAST_NAME,
                postalCode: POSTAL_CODE,
            },
            success: true,
        },
    ].forEach(({ error, infoFields, name, success }) => {
        let expectedStatus = " - ";

        if (success) expectedStatus = `Successful${expectedStatus}`;
        else if (error) expectedStatus = `Failure${expectedStatus}`;
        else expectedStatus = "";

        test(`${expectedStatus}Checkout the product w/ ${name}`, async ({
            cart,
            checkout,
            checkoutOverview,
            page,
        }) => {
            await cart.checkoutBtn.click();
            await checkout.waitUrl();

            await expect(checkout.title).toHaveText(/Your Information/);

            await checkout.fillInfoFields(infoFields);
            await checkout.continueBtn.click();

            if (error) {
                const [errLocator, closeBtn] = await checkout.error(error);

                await expect(errLocator).toBeVisible();
                await expect(closeBtn).toBeVisible();
            }

            if (success) {
                await checkoutOverview.waitUrl();

                await expect(page).toHaveURL(checkoutOverview.url);
                await expect(checkoutOverview.title).toHaveText(/Overview/);

                const items = await cart.items();

                for (let item of items) {
                    await expect(item).toBeVisible();
                }

                const subTotal = await cart.getSubTotalFromItems();

                await expect(checkoutOverview.subtotal).toHaveText(
                    `Item total: $${subTotal}`
                );

                await checkoutOverview.finishBtn.click();
            }
        });
    });
});
