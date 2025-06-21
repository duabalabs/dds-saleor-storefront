import { PaystackButton } from "@/components/checkout/PaystackButton";
import { useCheckout } from "@/checkout/hooks/useCheckout";

export const PaystackComponent = ({ gateway }: { gateway: { id: string; name: string } }) => {
	const { checkout } = useCheckout();

	if (!checkout) {
		return null;
	}

	return <PaystackButton gateway={gateway} checkout={checkout} />;
};
