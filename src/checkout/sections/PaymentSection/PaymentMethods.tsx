import { paymentMethodToComponent } from "./supportedPaymentApps";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/sections/PaymentSection/usePayments";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";

export const PaymentMethods = () => {
	const { availablePaymentGateways, fetching } = usePayments();
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	// Debug logging
	console.log("🔍 PaymentMethods - Available gateways:", availablePaymentGateways);
	console.log("🔍 PaymentMethods - Payment method mapping:", Object.keys(paymentMethodToComponent));

	// delivery methods change total price so we want to wait until the change is done
	if (changingBillingCountry || fetching || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	console.log("🎯 PaymentMethods - Rendering gateways:", availablePaymentGateways.length);

	return (
		<div className="gap-y-8">
			{availablePaymentGateways.map((gateway) => {
				const Component = paymentMethodToComponent[gateway.id];

				if (!Component) {
					return null;
				}

				return (
					<Component
						key={gateway.id}
						// @ts-expect-error -- gateway matches the id but TypeScript doesn't know that
						config={gateway}
					/>
				);
			})}
		</div>
	);
};
