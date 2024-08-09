import { test, expect } from ".";

test.describe("Product", () => {
    test.beforeEach(async ({ product, page }) => {
        await page.goto(product.url);
        await product.waitUrl();
    });

    test("Add to product to cart", async ({ page, baseURL, product, cart }) => {
        await expect(page).toHaveURL(`${baseURL!}${product.url}`);

        await test.step("Add products to cart", async () => {
            await product.addSpecificProduct();
            await product.addProduct("random");
            await product.cartLink.click();
        });

        await test.step("Navigate and verify products were added to cart", async () => {
            await cart.waitUrl();

            await expect(cart.title).toHaveText("Your Cart");

            const cartItems = await cart.items();

            expect(cartItems).toHaveLength(2);
        });
    });
});
