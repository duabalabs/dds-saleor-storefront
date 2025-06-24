import { useMemo } from "react";
import { useCheckoutCompleteMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useSubmit } from "@/checkout/hooks/useSubmit";

export const useCheckoutComplete = () => {
	const { checkout } = useCheckout();
	const [{ fetching }, checkoutComplete] = useCheckoutCompleteMutation();

	// Safely get checkout ID with fallback
	const checkoutId = checkout?.id;

	const onCheckoutComplete = useSubmit<{}, typeof checkoutComplete>(
		useMemo(
			() => ({
				parse: () => {
					if (!checkoutId) {
						throw new Error("Checkout ID not available - unable to complete checkout");
					}

					// Add additional validation for checkout state
					console.log("🔍 CHECKOUT COMPLETE: Validating checkout state:", {
						checkoutId,
						hasCheckout: !!checkout,
						totalPrice: checkout?.totalPrice?.gross?.amount,
						currency: checkout?.totalPrice?.gross?.currency,
						email: checkout?.email,
						linesCount: checkout?.lines?.length || 0,
						billingAddress: !!checkout?.billingAddress,
						shippingAddress: !!checkout?.shippingAddress,
						isShippingRequired: checkout?.isShippingRequired,
					});

					// Check if checkout has required fields
					if (!checkout?.email) {
						console.warn("⚠️ CHECKOUT COMPLETE: No email address in checkout");
					}

					if (checkout?.isShippingRequired && !checkout?.shippingAddress) {
						console.warn("⚠️ CHECKOUT COMPLETE: Shipping required but no shipping address");
					}

					console.log("🔍 CHECKOUT COMPLETE: Using checkout ID:", checkoutId);
					return {
						checkoutId,
					};
				},
				onSubmit: checkoutComplete,
				onSuccess: ({ data }) => {
					console.log("🎉 CHECKOUT COMPLETE: Success data:", data);
					const order = data.order;

					if (order) {
						console.log("📦 CHECKOUT COMPLETE: Order created with ID:", order.id);

						// Get current channel from URL for proper redirect
						const currentPath = window.location.pathname;
						const channelMatch = currentPath.match(/^\/([^\/]+)\//);
						const channel = channelMatch ? channelMatch[1] : "default-channel";

						// Redirect to order details page
						const orderDetailsUrl = `/${channel}/orders/${order.id}`;
						console.log("🔗 CHECKOUT COMPLETE: Redirecting to order details:", orderDetailsUrl);
						window.location.href = orderDetailsUrl;
					} else {
						console.error("❌ CHECKOUT COMPLETE: No order in response data");
					}
				},
				onError: ({ errors }) => {
					console.error("❌ CHECKOUT COMPLETE: Mutation failed with errors:", errors);
					// Log detailed error information for debugging
					errors.forEach((error, index) => {
						console.error(`❌ Error ${index + 1}:`, {
							code: error.code,
							field: error.field,
							message: error.message,
						});
					});
				},
			}),
			[checkoutComplete, checkoutId, checkout],
		),
	);

	// Return null for onCheckoutComplete if we don't have a checkout ID
	// This prevents the hook from being called when checkout context is lost
	return {
		completingCheckout: fetching,
		onCheckoutComplete: checkoutId ? onCheckoutComplete : null,
	};
};
