"use client";

import { useState } from "react";
import {
	type PaymentMethodProps,
	type PaystackPaymentData,
	type PaystackResponse,
	PAYSTACK_GATEWAY_ID,
} from "./types";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useTransactionInitializeMutation } from "@/checkout/graphql";

// Paystack SDK integration
declare global {
	interface Window {
		PaystackPop?: {
			setup: (config: {
				key: string;
				email: string;
				amount: number;
				currency: string;
				ref: string;
				callback: (response: PaystackResponse) => void;
				onClose: () => void;
			}) => {
				openIframe: () => void;
			};
		};
	}
}

export const PaystackComponent = ({ config }: PaymentMethodProps) => {
	// Debug: Log component initialization
	console.log("🔧 PaystackComponent initialized with config:", config);

	const { checkout } = useCheckout();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();
	const [, transactionInitialize] = useTransactionInitializeMutation();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Get configuration values
	const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
	const gatewayId = config?.id || PAYSTACK_GATEWAY_ID;

	// Debug logging for development
	if (process.env.NODE_ENV === "development") {
		console.log("🔧 PaystackComponent Debug:", {
			gatewayId,
			hasPublicKey: !!publicKey,
			checkoutId: checkout?.id,
			amount: checkout?.totalPrice?.gross.amount,
			currency: checkout?.totalPrice?.gross.currency,
		});
	}

	if (!checkout) {
		return (
			<div className="rounded-md bg-yellow-50 p-4">
				<div className="text-sm text-yellow-700">Loading checkout data...</div>
			</div>
		);
	}

	if (!publicKey) {
		return (
			<div className="rounded-md bg-red-50 p-4">
				<div className="text-sm text-red-700">
					Paystack configuration missing. Please set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY environment variable.
				</div>
			</div>
		);
	}

	const handlePayment = async (): Promise<void> => {
		if (!checkout || !publicKey) {
			setError("Payment configuration error");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const amount = checkout.totalPrice?.gross.amount || 0;
			const currency = checkout.totalPrice?.gross.currency || "USD";
			const email = checkout.email || "customer@example.com";
			const reference = `saleor_${checkout.id}_${Date.now()}`;

			// Convert amount to kobo (smallest currency unit for Paystack)
			const amountInKobo = Math.round(amount * 100);

			console.log("🚀 Initializing Paystack payment:", {
				amount: amountInKobo,
				currency,
				email,
				reference,
				gatewayId,
			});

			// Load Paystack script if not already loaded
			if (!window.PaystackPop) {
				await loadPaystackScript();
			}

			// Initialize Paystack payment
			const paystack = window.PaystackPop?.setup({
				key: publicKey,
				email,
				amount: amountInKobo,
				currency,
				ref: reference,
				callback: async (response: PaystackResponse) => {
					console.log("✅ Paystack payment successful:", response);
					await handlePaymentSuccess(response);
				},
				onClose: () => {
					console.log("❌ Paystack payment cancelled");
					setIsLoading(false);
					setError("Payment was cancelled");
				},
			});

			paystack?.openIframe();
		} catch (error) {
			console.error("❌ Payment initialization failed:", error);
			setError(error instanceof Error ? error.message : "Payment failed");
			setIsLoading(false);
		}
	};

	const handlePaymentSuccess = async (response: PaystackResponse): Promise<void> => {
		try {
			console.log("🔄 Initializing transaction in Saleor...");

			// Prepare payment data for Saleor following documentation patterns
			const paymentData: PaystackPaymentData = {
				reference: response.reference,
				amount: checkout.totalPrice?.gross.amount?.toString(),
				currency: checkout.totalPrice?.gross.currency,
				email: checkout.email || undefined,
				publicKey,
			};

			// Initialize transaction using Saleor's transactionInitialize mutation
			const result = await transactionInitialize({
				checkoutId: checkout.id,
				paymentGateway: {
					id: gatewayId,
					data: paymentData,
				},
			});

			console.log("📄 Transaction initialize result:", result);

			// Check for errors in the response
			if (result.data?.transactionInitialize?.errors?.length) {
				const errors = result.data.transactionInitialize.errors;
				console.error("❌ Transaction initialization errors:", errors);
				throw new Error(`Transaction failed: ${errors.map((e) => e.message).join(", ")}`);
			}

			// Complete the checkout
			console.log("🎯 Completing checkout...");
			if (onCheckoutComplete) {
				await onCheckoutComplete();
				console.log("🎉 Order completed successfully!");
			}
		} catch (error) {
			console.error("❌ Failed to complete transaction:", error);
			setError(error instanceof Error ? error.message : "Failed to complete order");
		} finally {
			setIsLoading(false);
		}
	};

	const loadPaystackScript = (): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (window.PaystackPop) {
				resolve();
				return;
			}

			const script = document.createElement("script");
			script.src = "https://js.paystack.co/v1/inline.js";
			script.onload = () => resolve();
			script.onerror = () => reject(new Error("Failed to load Paystack script"));
			document.head.appendChild(script);
		});
	};

	const isButtonDisabled = isLoading || completingCheckout || !checkout.totalPrice?.gross.amount;
	const buttonText = isLoading
		? "Processing Payment..."
		: completingCheckout
			? "Creating Order..."
			: `Pay ${checkout.totalPrice?.gross.amount} ${checkout.totalPrice?.gross.currency} with Paystack`;

	return (
		<div className="space-y-4">
			{/* Gateway Information */}
			<div className="rounded-md bg-blue-50 p-3 text-sm">
				<div className="font-medium text-blue-800">🚀 Paystack Payment Gateway</div>
				<div className="text-blue-700">Gateway ID: {gatewayId}</div>
				<div className="text-blue-700">
					Amount: {checkout.totalPrice?.gross.amount} {checkout.totalPrice?.gross.currency}
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="rounded-md bg-red-50 p-4">
					<div className="text-sm text-red-700">{error}</div>
				</div>
			)}

			{/* Payment Button */}
			<button
				onClick={() => void handlePayment()}
				disabled={isButtonDisabled}
				className={`w-full rounded-md px-4 py-3 font-medium text-white transition-colors ${
					isButtonDisabled
						? "cursor-not-allowed bg-gray-400"
						: "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
				}`}
			>
				{isLoading && (
					<span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
				)}
				{buttonText}
			</button>

			{/* Development Debug Info */}
			{process.env.NODE_ENV === "development" && (
				<details className="text-xs text-gray-500">
					<summary className="cursor-pointer">Debug Information</summary>
					<pre className="mt-2 whitespace-pre-wrap rounded bg-gray-50 p-2">
						{JSON.stringify(
							{
								gatewayId,
								checkoutId: checkout.id,
								hasPublicKey: !!publicKey,
								amount: checkout.totalPrice?.gross.amount,
								currency: checkout.totalPrice?.gross.currency,
								email: checkout.email,
							},
							null,
							2,
						)}
					</pre>
				</details>
			)}
		</div>
	);
};
