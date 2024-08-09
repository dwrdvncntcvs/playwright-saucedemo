import { test, expect } from ".";

test.describe("Product", () => {
    test.beforeEach(async ({ signIn, product }) => {
        await signIn.navigate();
        await signIn.fillFields({
            username: "standard_user",
            password: "secret_sauce",
        });
        await signIn.submit();

        await product.waitUrl();
    });

    test.afterEach(async ({ product }) => {
        await product.resetState();
    });

    test("Adding products to cart", async ({ product, page, cart }) => {
        const expectedNumberOfProduct = 2;
        await product.addToCart();

        await expect(product.cartBadge).toHaveText(
            expectedNumberOfProduct.toString()
        );

        await product.cartLink.click();
        await cart.waitUrl();

        await expect(page).toHaveURL("/cart.html");
        await expect(cart.title).toHaveText("Your Cart");

        const cartItems = await cart.items();

        expect(cartItems).toHaveLength(expectedNumberOfProduct);
        await expect(cart.cartBadge).toHaveText(
            expectedNumberOfProduct.toString()
        );
    });
});

test.describe("Checkout Page", () => {
    const expectedNumberOfProduct = 2;

    test.beforeEach(async ({ signIn, product, cart }) => {
        await signIn.navigate();
        await signIn.fillFields({
            username: "standard_user",
            password: "secret_sauce",
        });
        await signIn.submit();

        await product.waitUrl();

        await product.addToCart();
        await product.cartLink.click();
        await cart.waitUrl();
        const cartItems = await cart.items();

        expect(cartItems).toHaveLength(expectedNumberOfProduct);
    });
});
