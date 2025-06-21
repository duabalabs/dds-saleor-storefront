"use client";

import { useState, useCallback } from "react";
import { type PaymentMethodProps, type PaystackApiResponse, paystackGatewayId } from "./types";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useUser } from "@/checkout/hooks/useUser";
import { useTransactionInitializeMutation ,type  Checkout,type  PaymentGateway,type  TaxedMoney } from "@/checkout/graphql";

// Define interfaces for better type safety
interface StoredCheckoutData {
	id: string;
	totalPrice?: TaxedMoney;
	email?: string | null;
	availablePaymentGateways?: PaymentGateway[];
}

// Helper function to get checkout data with fallback - typed properly
const getCheckoutWithFallback = (checkout: Checkout | undefined): StoredCheckoutData | null => {
	// If we have live checkout data, use it
	if (checkout?.id) {
		return {
			id: checkout.id,
			totalPrice: checkout.totalPrice,
			email: checkout.email,
			availablePaymentGateways: checkout.availablePaymentGateways,
		};
	}

	// Otherwise try to get from session storage
	if (typeof window !== "undefined") {
		try {
			const stored = sessionStorage.getItem("saleor-checkout");
			if (stored) {
				const parsedData = JSON.parse(stored) as StoredCheckoutData;
				return parsedData;
			}
		} catch (error) {
			console.warn("Failed to parse stored checkout data:", error);
		}
	}

	return null;
};

// Store checkout data function
const storeCheckoutData = (checkout: Checkout): void => {
	if (typeof window !== "undefined" && checkout) {
		try {
			const dataToStore: StoredCheckoutData = {
				id: checkout.id,
				totalPrice: checkout.totalPrice,
				email: checkout.email,
				availablePaymentGateways: checkout.availablePaymentGateways,
			};
			sessionStorage.setItem("saleor-checkout", JSON.stringify(dataToStore));
		} catch (error) {
			console.warn("Failed to store checkout data:", error);
		}
	}
};

// Base URL for the Paystack payment app
const getPaystackAppUrl = (): string => {
	const envUrl = process.env.NEXT_PUBLIC_PAYSTACK_APP_URL;

	if (!envUrl) {
		const errorMessage = "NEXT_PUBLIC_PAYSTACK_APP_URL is not set in environment variables.";
		// Fail fast in development for easier debugging
		if (process.env.NODE_ENV === "development") {
			throw new Error(errorMessage);
		}
		// Log a critical error in production
		console.error(`FATAL: ${errorMessage}`);
		// Return empty string to cause a network error, which will be caught by the handler
		return "";
	}

	// Clean up trailing slash for consistency
	return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
};

export const PaystackComponent = (_props: PaymentMethodProps) => {
	const { checkout } = useCheckout();
	const { user } = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [, transactionInitialize] = useTransactionInitializeMutation();

	// Helper function to get checkout data with fallback - typed properly
	const getCheckoutData = useCallback((): StoredCheckoutData | null => {
		return getCheckoutWithFallback(checkout);
	}, [checkout]);

	if (!checkout) {
		// Try to get stored checkout data as fallback
		const fallbackCheckout = getCheckoutData();
		if (!fallbackCheckout) {
			return (
				<div className="rounded-md bg-yellow-50 p-4">
					<div className="text-sm text-yellow-700">Loading checkout data...</div>
				</div>
			);
		}
	}

	const handlePayment = async (): Promise<void> => {
		setIsLoading(true);
		setError(null);
		try {
			// Get current checkout data (with fallback)
			const currentCheckout = getCheckoutData();

			if (!currentCheckout) {
				setError("Checkout data not available. Please refresh the page and try again.");
				setIsLoading(false);
				return;
			}

			// Store checkout data before redirect using utility function
			// Only store if we have the original, live checkout object from useCheckout.
			// storeCheckoutData expects a Checkout object, not StoredCheckoutData.
			if (checkout) {
				storeCheckoutData(checkout);
			} else {
				// If 'checkout' (live data from useCheckout) is null, it means we might be
				// relying on 'currentCheckout' from storage. In this case, the data
				// is already stored, and we should not attempt to re-store StoredCheckoutData
				// as if it were a live Checkout object.
				if (currentCheckout) {
					// currentCheckout would be StoredCheckoutData here
					console.log(
						"PaystackComponent: Live checkout context not available. Relying on stored data. Skipping re-storage.",
					);
				}
			} // Get total amount from checkout
			const totalAmount = currentCheckout.totalPrice?.gross.amount ?? 0;

			// Get currency
			const currency = currentCheckout.totalPrice?.gross.currency ?? "NGN";

			// Get user email
			const email = user?.email ?? currentCheckout.email ?? "";
			if (!email) {
				setError("User email is required for Paystack payment");
				setIsLoading(false);
				return;
			}

			if (totalAmount <= 0) {
				setError("Invalid payment amount");
				setIsLoading(false);
				return;
			}

			// Step 1: Initialize transaction with Saleor before Paystack payment
			console.log("Initializing transaction with Saleor...");

			// Get the Paystack payment gateway specifically
			const availableGateways = currentCheckout.availablePaymentGateways ?? [];
			if (availableGateways.length === 0) {
				setError("No payment gateways available. Please contact support.");
				setIsLoading(false);
				return;
			}

			// Find the Paystack gateway specifically
			const paymentGateway = availableGateways.find(
				(gateway: PaymentGateway) => gateway.id === paystackGatewayId,
			);
			if (!paymentGateway) {
				console.error("Available gateways:", availableGateways);
				setError("Paystack payment gateway not found. Please contact support.");
				setIsLoading(false);
				return;
			}

			console.log("Using Paystack payment gateway:", paymentGateway);

			// Generate payment reference
			const paymentReference = `checkout-${currentCheckout.id}-${Date.now()}`;

			// Initialize transaction with Saleor
			const transactionResult = await transactionInitialize({
				checkoutId: currentCheckout.id,
				paymentGateway: {
					id: paymentGateway.id,
					data: {
						paymentReference,
						provider: "paystack",
						amount: totalAmount,
						currency,
						email,
					},
				},
				amount: Number(totalAmount),
			});

			if (transactionResult.error) {
				console.error("Transaction initialization failed:", transactionResult.error);
				setError(`Failed to initialize transaction: ${transactionResult.error.message}`);
				setIsLoading(false);
				return;
			}

			const transaction = transactionResult.data?.transactionInitialize?.transaction;
			if (!transaction?.id) {
				setError("Failed to create transaction. Please try again.");
				setIsLoading(false);
				return;
			}

			console.log("Transaction initialized successfully:", transaction.id);

			// Store transaction ID for later use in success handler
			sessionStorage.setItem("saleor-transaction-id", transaction.id);

			// Step 2: Store payment reference and checkout data for callback
			if (typeof window !== "undefined") {
				sessionStorage.setItem("paystack-reference", `checkout-${currentCheckout.id}-${Date.now()}`);
				sessionStorage.setItem("saleor-checkout-id", currentCheckout.id);
				// Also store the full checkout data
				sessionStorage.setItem("saleor-checkout", JSON.stringify(currentCheckout));
			} // Create iframe for payment or redirect to Paystack app
			const paystackUrl = `${getPaystackAppUrl()}/api/initialize-payment`;
			const requestBody = {
				email,
				amount: Math.round(Number(totalAmount) * 100), // Ensure amount is an integer in kobo
				reference: `checkout-${currentCheckout.id}-${Date.now()}`,
				metadata: {
					checkoutId: currentCheckout.id,
					currency,
					userId: user?.id,
				},
				callback_url: `${window.location.origin}/checkout?paymentStatus=success`,
			};

			console.log("Sending request to Paystack:", {
				url: paystackUrl,
				body: requestBody,
			});

			// Send request to initialize payment
			const response = await fetch(paystackUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const responseData = (await response.json()) as PaystackApiResponse;

			console.log("Paystack Response:", responseData);
			if (responseData.status && responseData.authorization_url) {
				// Redirect to Paystack payment page
				const authUrl: string = responseData.authorization_url;
				window.location.href = authUrl;
			} else {
				// Improved error message
				let message = "Unknown error during payment initialization";
				if (responseData.message) {
					message = responseData.message;
				} else if (responseData && !responseData.authorization_url) {
					message = "Authorization URL was not returned by the payment provider.";
				} else if (responseData && !responseData.status) {
					message = "Payment initialization failed.";
				}
				setError(`Failed to initialize payment: ${message}`);
			}
		} catch (error) {
			console.error("Error initializing Paystack payment:", error);
			setError(error instanceof Error ? error.message : "Failed to initialize payment");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mt-4 rounded-md border border-gray-200 p-4">
			{error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							className="h-6 w-6 text-green-600"
							fill="currentColor"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
					</div>
					<div className="ml-3">
						<span className="font-medium text-gray-900">Pay with Paystack</span>
						<p className="text-sm text-gray-500">Secure payment with cards, bank transfer & more</p>
					</div>
				</div>
				<button
					onClick={handlePayment}
					disabled={isLoading}
					className="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? (
						<span className="flex items-center">
							<svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Processing...
						</span>
					) : (
						"Pay Now"
					)}
				</button>
			</div>
			{(() => {
				const currentCheckout = getCheckoutData();
				return currentCheckout?.totalPrice ? (
					<div className="mt-3 text-sm text-gray-600">
						Amount: {currentCheckout.totalPrice.gross.currency} {currentCheckout.totalPrice.gross.amount}
					</div>
				) : null;
			})()}
		</div>
	);
};
