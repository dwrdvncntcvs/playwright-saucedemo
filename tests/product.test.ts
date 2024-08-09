import { test, expect } from ".";

test.describe("Product", () => {
    test.beforeEach(async ({ product, page }) => {
        await page.goto(product.url);
        await product.waitUrl();
    });

    test("Add to product to cart", async ({ page, baseURL, product, cart }) => {
        await expect(page).toHaveURL(`${baseURL!}${product.url}`);

        await product.addToCart();
        await product.cartLink.click();

        await cart.waitUrl();

        await expect(cart.title).toHaveText("Your Cart");

        const cartItems = await cart.items();

        expect(cartItems).toHaveLength(2);
    });
});
