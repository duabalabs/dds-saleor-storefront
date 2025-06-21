import Link from "next/link";
import { invariant } from "ts-invariant";
import { RootWrapper } from "./pageWrapper";

export const metadata = {
	title: "Checkout · Saleor Storefront example",
};

export default async function CheckoutPage(props: {
	searchParams: Promise<{
		checkout?: string;
		order?: string;
		paymentStatus?: string;
		trxref?: string;
		reference?: string;
		error?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	// Handle payment success callback
	if (searchParams.paymentStatus === "success" && (searchParams.trxref || searchParams.reference)) {
		const reference = searchParams.trxref || searchParams.reference;
		console.log("Payment success callback received with reference:", reference);

		// Continue with the normal checkout flow to let PaystackSuccessHandler handle it
	}

	// Handle payment errors
	if (searchParams.error) {
		console.error("Payment error:", searchParams.error);
	}

	// Only return null if there's no checkout, order, OR payment callback
	if (!searchParams.checkout && !searchParams.order && !searchParams.paymentStatus && !searchParams.error) {
		return null;
	}

	return (
		<div className="min-h-dvh bg-white">
			<section className="mx-auto flex min-h-dvh max-w-7xl flex-col p-8">
				<div className="flex items-center font-bold">
					<Link aria-label="homepage" href="/">
						ACME
					</Link>
				</div>
				<h1 className="mt-8 text-3xl font-bold text-neutral-900">Checkout</h1>

				<section className="mb-12 mt-6 flex-1">
					<RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />
				</section>
			</section>
		</div>
	);
}
