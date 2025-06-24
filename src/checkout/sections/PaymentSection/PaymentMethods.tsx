"use client";

import { PaystackComponent } from "./Paystack/PaystackComponent";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import type { PaymentGateway } from "@/checkout/graphql";

// Debug: Check if PaystackComponent is imported correctly
console.log("🔍 PaymentMethods: PaystackComponent import =", PaystackComponent);

export const PaymentMethods = () => {
	const { checkout } = useCheckout();
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	// Show loading skeleton while data is being updated
	if (changingBillingCountry || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	// Get available payment gateways from checkout
	const paymentGateways = checkout?.availablePaymentGateways ?? [];

	// Debug logging for development
	if (process.env.NODE_ENV === "development") {
		console.log("🔍 PaymentMethods Debug:", {
			checkoutId: checkout?.id,
			totalAmount: checkout?.totalPrice?.gross.amount,
			currency: checkout?.totalPrice?.gross.currency,
			availableGateways: paymentGateways.length,
			gateways: paymentGateways.map((g) => ({ id: g.id, name: g.name })),
		});
	}

	if (!checkout) {
		return (
			<div className="rounded-md bg-yellow-50 p-4">
				<div className="text-sm text-yellow-700">Loading checkout data...</div>
			</div>
		);
	}

	if (paymentGateways.length === 0) {
		return (
			<div className="rounded-md bg-red-50 p-4">
				<div className="text-sm text-red-700">
					No payment gateways are available. Please check your Saleor configuration.
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium text-gray-900">Payment Method</h3>

			{/* Debug info for development */}
			{process.env.NODE_ENV === "development" && (
				<div className="rounded-md bg-blue-50 p-3 text-sm">
					<div className="font-medium text-blue-800">Debug Info:</div>
					<div className="text-blue-700">Found {paymentGateways.length} payment gateway(s)</div>
					<div className="text-blue-700">
						Total: {checkout.totalPrice?.gross.amount} {checkout.totalPrice?.gross.currency}
					</div>
				</div>
			)}

			{/* Render payment gateway components */}
			<div className="space-y-3">
				{paymentGateways.map((gateway: PaymentGateway) => {
					// Handle Paystack gateway
					if (gateway.id === "saleor.app.paystack.sammydamz" || gateway.id.includes("paystack")) {
						return (
							<div key={gateway.id} className="space-y-2">
								<div className="rounded bg-green-50 p-2 text-sm font-medium text-green-700">
									✅ Paystack Gateway: {gateway.name}
								</div>
								<PaystackComponent config={gateway} />
							</div>
						);
					}

					// Handle other gateways (placeholder for future implementation)
					return (
						<div key={gateway.id} className="rounded-md border border-gray-200 p-4">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium text-gray-900">{gateway.name}</div>
									<div className="text-sm text-gray-500">Gateway ID: {gateway.id}</div>
								</div>
								<div className="text-sm text-yellow-600">Implementation pending</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
