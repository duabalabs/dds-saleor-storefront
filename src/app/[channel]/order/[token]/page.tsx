import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderConfirmationSection } from "../../../../checkout/sections/OrderConfirmationSection";

interface OrderPageProps {
	params: Promise<{
		channel: string;
		token: string;
	}>;
}

export const metadata: Metadata = {
	title: "Order Confirmation",
	description: "Your order has been successfully placed.",
};

export default async function OrderPage({ params }: OrderPageProps) {
	const { channel, token } = await params;

	if (!token) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<OrderConfirmationSection token={token} channel={channel} />
		</div>
	);
}
