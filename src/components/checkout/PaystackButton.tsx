import { gql, useMutation } from "urql";

const CHECKOUT_PAYMENT_CREATE_MUTATION = gql`
	mutation CheckoutPaymentCreate($checkoutId: ID!, $gateway: String!, $amount: PositiveDecimal!) {
		checkoutPaymentCreate(id: $checkoutId, input: { gateway: $gateway, amount: $amount }) {
			payment {
				id
				gateway
			}
			paymentUrl
			errors {
				code
				field
				message
			}
		}
	}
`;

interface CheckoutPaymentCreatePayload {
	payment?: {
		id: string;
		gateway: string;
	} | null;
	paymentUrl?: string | null;
	errors: {
		code: string;
		field?: string | null;
		message?: string | null;
	}[];
}

interface CheckoutPaymentCreateMutation {
	checkoutPaymentCreate?: CheckoutPaymentCreatePayload | null;
}

interface CheckoutPaymentCreateVariables {
	checkoutId: string;
	gateway: string;
	amount: number;
}

interface PaystackButtonProps {
	gateway?: { id: string; name: string } | null;
	checkout: { id: string; totalPrice: { gross: { amount: number } } };
}

export function PaystackButton({ gateway, checkout }: PaystackButtonProps) {
	// Hook must be called before any conditional returns
	const [{ fetching: loading, error }, createPayment] = useMutation<
		CheckoutPaymentCreateMutation,
		CheckoutPaymentCreateVariables
	>(CHECKOUT_PAYMENT_CREATE_MUTATION);

	// Early return if gateway is not available
	if (!gateway?.id || !gateway?.name) {
		return null;
	}

	const handlePayment = async () => {
		if (!gateway?.id) {
			console.error("Gateway ID is not available");
			alert("Payment gateway is not available. Please try again.");
			return;
		}

		try {
			const result = await createPayment({
				checkoutId: checkout.id,
				gateway: gateway.id,
				amount: checkout.totalPrice.gross.amount,
			});

			const paymentUrl = result.data?.checkoutPaymentCreate?.paymentUrl;
			const paymentId = result.data?.checkoutPaymentCreate?.payment?.id;
			const checkoutId = checkout.id;

			if (paymentId && checkoutId) {
				sessionStorage.setItem("saleorTransactionId", paymentId);
				sessionStorage.setItem("saleorCheckoutId", checkoutId);
			}

			if (paymentUrl) {
				window.location.href = paymentUrl;
			} else {
				const errors = result.data?.checkoutPaymentCreate?.errors || [];
				console.error("Failed to get payment URL:", errors);
				alert(`Could not initiate payment: ${errors.map((e) => e.message).join(", ")}`);
			}
		} catch (e) {
			console.error("Error creating payment:", e);
			alert("An unexpected error occurred while trying to process the payment. Please try again.");
		}
		if (error) {
			console.error("Error creating payment:", error);
			alert(
				`An unexpected error occurred while trying to process the payment: ${error.message}. Please try again.`,
			);
		}
	};

	return (
		<button onClick={handlePayment} disabled={loading} style={{ marginTop: "10px", padding: "10px 15px" }}>
			{loading ? "Processing..." : `Pay with ${gateway?.name ?? "Paystack"}`}
		</button>
	);
}
