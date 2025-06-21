# Paystack Storefront Integration Tasks

This document outlines the tasks required to integrate the Paystack payment gateway into the Saleor storefront, based on the comprehensive integration guide.

## 1. Fetch Available Payment Gateways

- [x] **Locate Checkout Query:** Find the GraphQL query responsible for fetching checkout details (likely in a file related to the checkout page or context).
- [x] **Update Checkout Query:** Modify the query to include the `availablePaymentGateways` field with `id`, `name`, and `config`.

  ```graphql
  # Add this to your checkout query
  availablePaymentGateways {
    id
    name
    config {
      field
      value
    }
  }
  ```

## 2. Create the Payment Button Component

- [x] **Create New File:** Create a new component file at `src/components/checkout/PaystackButton.tsx` (or a similar appropriate location).
- [x] **Define GraphQL Mutation:** Add the `CHECKOUT_PAYMENT_CREATE_MUTATION` to the new file.
- [x] **Build Component Logic:** Implement the `PaystackButton` React component.
  - [x] Define the `PaystackButtonProps` interface.
  - [x] Use the `useMutation` hook with the defined mutation.
  - [x] Implement the `handlePayment` async function to call the mutation.
  - [x] Add logic to get the `paymentUrl` from the mutation result and redirect the user using `window.location.href`.
  - [x] Add loading and error handling states.
- [x] **Store Transaction ID:** Before redirecting, store the `payment.id` from the `checkoutPaymentCreate` response in `sessionStorage`. This is crucial for the callback step.

  ```typescript
  // Inside handlePayment, after getting the result
  const paymentId = result.data?.checkoutPaymentCreate?.payment?.id;
  const checkoutId = checkout.id;

  if (paymentId && checkoutId) {
  	sessionStorage.setItem("saleorTransactionId", paymentId);
  	sessionStorage.setItem("saleorCheckoutId", checkoutId);
  }
  ```

## 3. Render the Button at Checkout

- [x] **Identify Payment View:** Locate the component responsible for rendering payment options in the checkout flow (e.g., `PaymentSection.tsx`).
- [x] **Import Button:** Import the newly created `PaystackButton` component.
- [x] **Render Buttons:** Map over the `checkout.availablePaymentGateways` array and render a `PaystackButton` for each gateway.
- [x] **Handle No Gateways:** Add a fallback UI to inform the user if no payment gateways are available.

## 4. Handle the Paystack Callback

- [x] **Create Callback Page:** Create a new page file at `src/app/checkout/paystack/callback/page.tsx`.
- [x] **Define GraphQL Mutations:** Add the `TRANSACTION_PROCESS` and `CHECKOUT_COMPLETE` GraphQL mutations to the callback page file.
- [x] **Implement Callback Logic:**
  - [x] Use the `useRouter` hook to get the `reference` (`trxref`) from the URL query parameters.
  - [x] Use `useMutation` for both `TRANSACTION_PROCESS` and `CHECKOUT_COMPLETE`.
  - [x] Use a `useEffect` hook that runs when the `reference` is available.
  - [x] Inside the effect, retrieve the `transactionId` and `checkoutId` from `sessionStorage`.
  - [x] Call the `processTransaction` mutation, passing the `transactionId` and the Paystack `reference`.
  - [x] On successful processing, call the `completeCheckout` mutation.
  - [x] If checkout is completed successfully, redirect the user to the order confirmation page.
  - [x] Implement robust error handling for missing data and failed mutations, redirecting the user back to the checkout page with an error message.

## 5. Final Verification

- [ ] **End-to-End Test:** Perform a full payment flow in a development environment.
  - [ ] Add an item to the cart.
  - [ ] Proceed to checkout.
  - [ ] Verify the "Pay with Paystack" button appears.
  - [ ] Click the button and confirm redirection to Paystack.
  - [ ] Use a test card to complete the payment.
  - [ ] Confirm redirection back to the storefront's callback URL.
  - [ ] Verify that the payment is processed and the user is redirected to the order confirmation page.

## Troubleshooting

### Error: "No available payment gateways"

- [x] **Root Cause Identified:** The `getFilteredPaymentGateways` function in `utils.ts` was filtering out the Paystack gateway because it wasn't included in the `supportedPaymentGateways` array.
- [x] **Fix Applied:** Added `paystackGatewayId` to the `supportedPaymentGateways` array in `src/checkout/sections/PaymentSection/utils.ts`.
- [x] **Debug Logging Added:** Added console logs to help debug payment gateway filtering.

**Required Backend Configuration:**

1. Ensure Paystack payment app is installed and active in Saleor
2. Verify the app has `HANDLE_PAYMENTS` permission
3. Configure the app for the correct channel and currency
4. Ensure the app ID matches `paystackGatewayId` in the storefront

**For Testing:**

- Enable the "Dummy" payment plugin in Saleor Dashboard → Configuration → Plugins
- This allows testing the payment flow without a real payment provider
