import Link from "next/link";
import { type Metadata } from "next";

export const metadata: Metadata = {
	title: "Order Confirmation · Saleor Storefront example",
};

interface OrderConfirmationPageProps {
	searchParams: Promise<{
		order?: string;
	}>;
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
	const params = await searchParams;
	const orderToken = params.order;

	if (!orderToken) {
		return (
			<div className="min-h-dvh bg-white">
				<section className="mx-auto flex min-h-dvh max-w-7xl flex-col p-8">
					<div className="flex items-center font-bold">
						<Link aria-label="homepage" href="/">
							ACME
						</Link>
					</div>
					<div className="flex flex-grow flex-col items-center justify-center">
						<h1 className="mb-4 text-3xl font-bold text-neutral-900">Order Not Found</h1>
						<p className="mb-6 text-neutral-600">We couldn&apos;t find your order information.</p>
						<Link
							href="/"
							className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
						>
							Continue Shopping
						</Link>
					</div>
				</section>
			</div>
		);
	}

	return (
		<div className="min-h-dvh bg-white">
			<section className="mx-auto flex min-h-dvh max-w-7xl flex-col p-8">
				<div className="flex items-center font-bold">
					<Link aria-label="homepage" href="/">
						ACME
					</Link>
				</div>

				<div className="flex flex-grow flex-col items-center justify-center text-center">
					<div className="mb-8">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h1 className="mb-2 text-3xl font-bold text-neutral-900">Order Confirmed!</h1>
						<p className="mb-6 text-neutral-600">
							Thank you for your purchase. Your order has been successfully processed.
						</p>
						<div className="mb-6 rounded-lg bg-gray-50 p-4">
							<p className="text-sm text-gray-600">Order Token:</p>
							<p className="break-all font-mono text-sm text-gray-800">{orderToken}</p>
						</div>
					</div>

					<div className="flex gap-4">
						<Link
							href="/"
							className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
						>
							Continue Shopping
						</Link>
						<Link
							href={`/orders/${orderToken}`}
							className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
						>
							View Order Details
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
