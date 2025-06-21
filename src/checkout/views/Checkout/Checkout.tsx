import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmptyCartPage } from "../EmptyCartPage";
import { PageNotFound } from "../PageNotFound";
import { useUser } from "../../hooks/useUser";
import { Summary, SummarySkeleton } from "@/checkout/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout/sections/CheckoutForm";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { CheckoutSkeleton } from "@/checkout/views/Checkout/CheckoutSkeleton";
import { PaystackSuccessHandler } from "@/checkout/sections/PaymentSection/Paystack/PaystackSuccessHandler";

// Helper function to get URL search params using web APIs
const getUrlSearchParams = (): URLSearchParams => {
	if (typeof window !== "undefined") {
		return new URLSearchParams(window.location.search);
	}
	return new URLSearchParams();
};

export const Checkout = () => {
	const { checkout, fetching: fetchingCheckout } = useCheckout();
	const { loading: isAuthenticating } = useUser();
	const searchParams = getUrlSearchParams();

	// Check if this is a payment success callback
	const paymentStatus = searchParams.get("paymentStatus");
	const trxref = searchParams.get("trxref");
	const reference = searchParams.get("reference");
	const isPaymentCallback = paymentStatus === "success" && (trxref || reference);

	const isCheckoutInvalid = !fetchingCheckout && !checkout && !isAuthenticating && !isPaymentCallback;

	const isInitiallyAuthenticating = isAuthenticating && !checkout;
	const isEmptyCart = checkout && !checkout.lines.length;

	// Always render PaystackSuccessHandler for payment callbacks
	if (isPaymentCallback) {
		return <PaystackSuccessHandler />;
	}

	return isCheckoutInvalid ? (
		<PageNotFound />
	) : isInitiallyAuthenticating ? (
		<CheckoutSkeleton />
	) : (
		<ErrorBoundary FallbackComponent={PageNotFound}>
			{/* Handle Paystack payment success */}
			<PaystackSuccessHandler />

			<div className="page">
				{isEmptyCart ? (
					<EmptyCartPage />
				) : (
					<div className="grid min-h-screen grid-cols-1 gap-x-16 lg:grid-cols-2">
						<Suspense fallback={<CheckoutFormSkeleton />}>
							<CheckoutForm />
						</Suspense>
						<Suspense fallback={<SummarySkeleton />}>
							<Summary {...checkout} />
						</Suspense>
					</div>
				)}
			</div>
		</ErrorBoundary>
	);
};
