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

        await product.addSpecificProduct();
        await product.addProduct("random");

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
        test(`${
            success ? "Successful" : "Failure"
        } - Checkout the product w/ ${name}`, async ({
            cart,
            checkout,
            checkoutOverview,
            checkoutComplete,
            page,
        }) => {
            await test.step("Checkout products and fill information and continue", async () => {
                await cart.checkoutBtn.click();
                await checkout.waitUrl();

                await expect(checkout.title).toHaveText(/Your Information/);

                await checkout.fillInfoFields(infoFields);
                await checkout.continueBtn.click();
            });

            if (error) {
                const [errLocator, closeBtn] = await checkout.error(error);

                await expect(errLocator).toBeVisible();
                await expect(closeBtn).toBeVisible();
            }

            if (success) {
                await test.step("Navigate to checkout overview", async () => {
                    await checkoutOverview.waitUrl();

                    await expect(page).toHaveURL(checkoutOverview.url);
                    await expect(checkoutOverview.title).toHaveText(/Overview/);
                });

                await test.step("Verify the items in the page and the subtotal", async () => {
                    const items = await cart.items();

                    for (let item of items) await expect(item).toBeVisible();

                    const subTotal = await cart.getSubTotalFromItems();

                    await expect(checkoutOverview.subtotal).toHaveText(
                        `Item total: $${subTotal}`
                    );

                    await checkoutOverview.finishBtn.click();
                });

                await test.step("Complete the order process", async () => {
                    await checkoutComplete.waitUrl();

                    await expect(checkoutComplete.title).toHaveText(/Complete/);
                    await expect(page).toHaveURL(checkoutComplete.url);
                    await expect(checkoutComplete.message).toBeVisible();
                    await expect(checkoutComplete.backHomeBtn).toBeVisible();
                });
            }
        });
    });
});
