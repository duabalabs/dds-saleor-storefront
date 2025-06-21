import { test, expect } from "@playwright/test";

test.describe("Paystack Payment Flow", () => {
	test("should complete a checkout with Paystack", async ({ page }) => {
		// 1. Go to a product page and add it to the cart
		await page.goto("/products/example-product"); // Replace with a valid product slug
		await page.getByRole("button", { name: "Add to cart" }).click();

		// 2. Go to the cart and proceed to checkout
		await page.getByRole("link", { name: "Cart" }).click();
		await page.getByRole("link", { name: "Proceed to Checkout" }).click();

		// 3. Fill in checkout details (assuming guest checkout)
		await page.getByLabel("Email").fill("test@example.com");
		// Fill other required fields like shipping address if necessary

		// 4. Select Paystack as the payment method and verify the button
		await expect(page.getByRole("button", { name: "Pay with Paystack" })).toBeVisible();

		// 5. Click the Paystack button and assert the redirect
		await page.getByRole("button", { name: "Pay with Paystack" }).click();
		await page.waitForURL("**/paystack.com/**");
		await expect(page).toHaveURL(/paystack.com/);

		// --- Manual intervention needed here for a real test ---
		// The test would pause here, and a real user would need to complete the payment on the Paystack page.
		// For a fully automated test, you would need to use Paystack's test credentials and APIs to simulate the payment.

		// 6. After payment, assert the redirect back to the callback URL
		await page.waitForURL("**/checkout/paystack/callback**");
		await expect(page).toHaveURL(/\/checkout\/paystack\/callback/);

		// 7. Assert the final redirect to the order confirmation page
		await page.waitForURL("**/order/**");
		await expect(page).toHaveURL(/\/order\//);
		await expect(page.getByText("Thank you for your order")).toBeVisible();
	});
});
