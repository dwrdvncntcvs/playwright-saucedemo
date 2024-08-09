import { test, expect } from ".";

test.describe("Login Page", () => {
    const PASSWORD = "secret_sauce";

    [
        {
            name: "missing username",
            credentials: { username: "", password: "" },
            error: "Username is required",
        },
        {
            name: "missing password",
            credentials: { username: "sample", password: "" },
            error: "Password is required",
        },
        {
            name: "invalid credentials",
            credentials: { username: "sample", password: "sample" },
            error: "Username and password do not match any user in this service",
        },
        {
            name: "locked out user",
            credentials: { username: "locked_out_user", password: PASSWORD },
            error: "Sorry, this user has been locked out.",
        },
    ].forEach(({ name, credentials, error }) =>
        test(`Fail - Signing in w/ ${name}`, async ({ signIn }) => {
            await signIn.navigate();

            await test.step("Fill Form", async () => {
                await signIn.fillFields(credentials);
                await signIn.submit();
            });

            await test.step("Assert", async () => {
                const [errorLocator, errCloseBtn] = await signIn.error(error);

                await expect(errorLocator).toBeVisible();
                await expect(errCloseBtn).toBeVisible();
            });
        })
    );

    [
        "standard_user",
        "problem_user",
        "performance_glitch_user",
        "error_user",
        "visual_user",
    ].forEach((username) =>
        test(`Successful - Signing in w/ valid credentials for ${username}`, async ({
            signIn,
            product,
        }) => {
            await signIn.navigate();

            await test.step("Fill Form", async () => {
                await signIn.fillFields({ username, password: PASSWORD });
                await signIn.submit();
                await product.waitUrl();
            });

            await test.step("Successfully navigate product page", async () => {
                await expect(product.title).toBeVisible();
                await expect(product.title).toHaveText("Products");
            });
        })
    );
});
