import { PaystackComponent } from "./Paystack/PaystackComponent";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";

export const PaymentMethods = () => {
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	// delivery methods change total price so we want to wait until the change is done
	if (changingBillingCountry || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	// Simple direct rendering of Paystack - no gateway initialization needed
	return (
		<div className="gap-y-8">
			<PaystackComponent config={null} />
		</div>
	);
};
