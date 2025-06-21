"use client";

import { useEffect, useState } from "react";
import { useMutation, gql } from "urql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useTransactionProcessMutation ,type  TaxedMoney } from "@/checkout/graphql";

const CHECKOUT_COMPLETE_MUTATION = gql`
	mutation checkoutComplete($checkoutId: ID!, $paymentData: JSONString) {
		checkoutComplete(id: $checkoutId, paymentData: $paymentData) {
			order {
				id
				token
			}
			errors {
				field
				message
			}
		}
	}
`;

// Types for checkoutComplete mutation
interface CheckoutCompleteError {
	field: string | null;
	message: string | null;
}

interface CheckoutCompleteOrder {
	id: string;
	token: string;
}

interface CheckoutCompletePayload {
	order: CheckoutCompleteOrder | null;
	errors: CheckoutCompleteError[];
}

interface CheckoutCompleteMutation {
	checkoutComplete: CheckoutCompletePayload | null;
}

interface CheckoutCompleteVariables {
	checkoutId: string;
	paymentData?: string;
}

// Interface for stored checkout data
interface StoredCheckoutData {
	id: string;
	totalPrice?: TaxedMoney;
	email?: string | null;
}

// Helper function to get URL search parameters
const getUrlSearchParams = (): URLSearchParams => {
	if (typeof window !== "undefined") {
		return new URLSearchParams(window.location.search);
	}
	return new URLSearchParams();
};

// Helper function to get channel from URL
const getChannelFromUrl = (): string => {
	if (typeof window !== "undefined") {
		const pathParts = window.location.pathname.split("/");
		return pathParts[1] || "default-channel";
	}
	return "default-channel";
};

// Helper function to navigate
const navigateToUrl = (url: string): void => {
	if (typeof window !== "undefined") {
		window.location.href = url;
	}
};

export const PaystackSuccessHandler = () => {
	const { showCustomErrors } = useAlerts();
	const [isProcessing, setIsProcessing] = useState(false);
	const [, completeCheckout] = useMutation<CheckoutCompleteMutation, CheckoutCompleteVariables>(
		CHECKOUT_COMPLETE_MUTATION,
	);

	const [, transactionProcess] = useTransactionProcessMutation();

	useEffect(() => {
		const handlePaymentSuccess = async (): Promise<void> => {
			const searchParams = getUrlSearchParams();
			const paymentStatus = searchParams.get("paymentStatus");
			const trxref = searchParams.get("trxref");
			const reference = searchParams.get("reference");

			// Check if this is a Paystack success callback
			if (paymentStatus === "success" && (trxref || reference)) {
				const paymentReference = trxref || reference;
				console.log("Processing Paystack payment success with reference:", paymentReference);
				setIsProcessing(true);

				try {
					// Get stored checkout ID and data
					const storedCheckoutId = sessionStorage.getItem("saleor-checkout-id");
					const storedCheckoutData = sessionStorage.getItem("saleor-checkout");

					let checkoutId: string | null = storedCheckoutId;
					let checkoutData: StoredCheckoutData | null = null;

					// If no stored checkout ID, try to get from stored checkout data
					if (!checkoutId && storedCheckoutData) {
						try {
							const parsedData = JSON.parse(storedCheckoutData) as StoredCheckoutData;
							checkoutData = parsedData;
							checkoutId = parsedData.id ?? null;
						} catch (error) {
							console.warn("Failed to parse stored checkout data:", error);
						}
					} else if (storedCheckoutData) {
						try {
							checkoutData = JSON.parse(storedCheckoutData) as StoredCheckoutData;
						} catch (error) {
							console.warn("Failed to parse stored checkout data:", error);
						}
					}

					if (!checkoutId) {
						throw new Error("No checkout ID found. Please try again.");
					} // Verify the payment with Paystack (optional due to CORS)
					const paystackAppUrl = process.env.NEXT_PUBLIC_PAYSTACK_APP_URL;

					if (paystackAppUrl) {
						console.log("Verifying payment with Paystack...");
						try {
							// Clean up URL to avoid double slashes
							const cleanUrl = paystackAppUrl.endsWith("/") ? paystackAppUrl.slice(0, -1) : paystackAppUrl;
							const verifyResponse = await fetch(`${cleanUrl}/api/verify-payment`, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									reference: paymentReference,
								}),
							});

							if (verifyResponse.ok) {
								const verificationResult = (await verifyResponse.json()) as {
									status: boolean;
									data?: { status: string };
									message?: string;
								};

								if (!verificationResult.status || verificationResult.data?.status !== "success") {
									console.warn("Payment verification failed with Paystack, but proceeding anyway...");
								} else {
									console.log("Payment verified successfully with Paystack");
								}
							} else {
								console.warn("Failed to verify payment with Paystack, proceeding anyway...");
							}
						} catch (error) {
							console.warn(
								"Payment verification failed due to CORS or network error, proceeding anyway...",
								error,
							);
						}
					}

					// Step 3: Process the transaction with Saleor
					console.log("Processing transaction with Saleor...");

					// Get the stored transaction ID
					const transactionId = sessionStorage.getItem("saleor-transaction-id");
					if (!transactionId) {
						console.error("No transaction ID found. Cannot process transaction.");
						throw new Error("Transaction ID not found. Please try the payment again.");
					} // Process the transaction to mark it as successful
					const processResult = await transactionProcess({
						id: transactionId,
						data: {
							paymentReference,
							paystackStatus: "success",
							amount: checkoutData?.totalPrice?.gross?.amount,
							currency: checkoutData?.totalPrice?.gross?.currency,
							verificationData: "Payment verified successfully",
						},
					});

					if (processResult.error) {
						console.error("Transaction processing failed:", processResult.error);
						throw new Error(`Failed to process transaction: ${processResult.error.message}`);
					}

					const transactionEvent = processResult.data?.transactionProcess?.transactionEvent;
					if (
						!transactionEvent ||
						!["CHARGE_SUCCESS", "AUTHORIZATION_SUCCESS"].includes(transactionEvent.type || "")
					) {
						console.error("Transaction processing did not result in success:", transactionEvent);
						throw new Error("Transaction processing failed. Payment may not have been recorded properly.");
					}
					console.log("Transaction processed successfully:", transactionEvent.type);

					// Step 4: Complete the checkout with Saleor
					console.log("Completing checkout with Saleor...");

					// Since we've processed the transaction, complete checkout without payment data
					// Saleor should now recognize the transaction covers the checkout total
					const completeResult = await completeCheckout({
						checkoutId,
					});

					if (completeResult.error || (completeResult.data?.checkoutComplete?.errors?.length ?? 0) > 0) {
						const errors = completeResult.data?.checkoutComplete?.errors || [];
						console.error("Checkout completion failed:", {
							error: completeResult.error,
							checkoutErrors: errors,
							checkoutId,
							paymentReference,
						});
						// Check if it's a payment coverage error
						const hasPaymentError = errors.some(
							(err: CheckoutCompleteError) =>
								err.message?.includes("payment") ||
								err.message?.includes("cover") ||
								err.message?.includes("amount"),
						);

						if (hasPaymentError) {
							throw new Error(
								`Payment validation failed: ${errors
									.map((e: CheckoutCompleteError) => e.message)
									.join(", ")}`,
							);
						} else {
							throw new Error(
								`Checkout completion failed: ${errors
									.map((e: CheckoutCompleteError) => e.message)
									.join(", ")}`,
							);
						}
					}

					const order = completeResult.data?.checkoutComplete?.order;
					if (order?.token) {
						console.log("Order created successfully:", order.token);
						// Clean up session storage
						sessionStorage.removeItem("saleor-checkout-id");
						sessionStorage.removeItem("saleor-checkout");
						sessionStorage.removeItem("paystack-reference");
						sessionStorage.removeItem("saleor-transaction-id");
						// Redirect to order confirmation
						const channel = getChannelFromUrl();
						navigateToUrl(`/${channel}/order/${order.token}`);
					} else {
						throw new Error("Order creation failed - no order token received");
					}
				} catch (error) {
					console.error("Error processing payment success:", error);
					showCustomErrors([
						{
							message: `Payment processing failed: ${
								error instanceof Error ? error.message : "Unknown error"
							}. Please contact support.`,
						},
					]);
					// Clear URL parameters to prevent loops
					navigateToUrl("/checkout?error=payment_processing_failed");
				} finally {
					setIsProcessing(false);
				}
			}
		};
		void handlePaymentSuccess();
	}, [completeCheckout, showCustomErrors, transactionProcess]);

	// Show processing screen while handling payment success
	const searchParams = getUrlSearchParams();
	const paymentStatus = searchParams.get("paymentStatus");
	const trxref = searchParams.get("trxref");
	const reference = searchParams.get("reference");

	if (paymentStatus === "success" && (trxref || reference) && isProcessing) {
		return (
			<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-75">
				<div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-8 shadow-lg">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
					<h2 className="text-lg font-semibold text-gray-900">Processing your payment...</h2>
					<p className="text-sm text-gray-600">Please wait while we complete your order.</p>
				</div>
			</div>
		);
	}

	return null;
};
