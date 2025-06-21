"use client";

import { useEffect, useState } from "react";
import { useMutation, gql } from "urql";
import { Check } from "lucide-react";

const ORDER_BY_TOKEN_QUERY = gql`
	query OrderByToken($token: UUID!) {
		orderByToken(token: $token) {
			id
			number
			status
			created
			total {
				gross {
					amount
					currency
				}
			}
			billingAddress {
				firstName
				lastName
				companyName
				streetAddress1
				streetAddress2
				city
				cityArea
				postalCode
				country {
					country
				}
				countryArea
				phone
			}
			shippingAddress {
				firstName
				lastName
				companyName
				streetAddress1
				streetAddress2
				city
				cityArea
				postalCode
				country {
					country
				}
				countryArea
				phone
			}
			lines {
				id
				productName
				variantName
				quantity
				totalPrice {
					gross {
						amount
						currency
					}
				}
			}
		}
	}
`;

// Local types for the order query
interface OrderAddress {
	firstName: string;
	lastName: string;
	companyName: string | null;
	streetAddress1: string;
	streetAddress2: string | null;
	city: string;
	cityArea: string | null;
	postalCode: string;
	country: { country: string };
	countryArea: string | null;
	phone: string | null;
}

interface OrderLine {
	id: string;
	productName: string;
	variantName: string | null;
	quantity: number;
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
}

interface Order {
	id: string;
	number: string;
	status: string;
	created: string;
	total: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	billingAddress: OrderAddress | null;
	shippingAddress: OrderAddress | null;
	lines: OrderLine[];
}

interface OrderByTokenQuery {
	orderByToken: Order | null;
}

interface OrderByTokenVariables {
	token: string;
}

interface OrderConfirmationSectionProps {
	token: string;
	channel: string;
}

export const OrderConfirmationSection = ({ token, channel }: OrderConfirmationSectionProps) => {
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [, executeOrderByToken] = useMutation<OrderByTokenQuery, OrderByTokenVariables>(ORDER_BY_TOKEN_QUERY);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				setLoading(true);
				const result = await executeOrderByToken({ token });

				if (result.error) {
					console.error("Error fetching order:", result.error);
					setError("Failed to load order details");
					return;
				}

				if (!result.data?.orderByToken) {
					setError("Order not found");
					return;
				}

				setOrder(result.data.orderByToken);
			} catch (err) {
				console.error("Error fetching order:", err);
				setError("Failed to load order details");
			} finally {
				setLoading(false);
			}
		};

		void fetchOrder();
	}, [token, executeOrderByToken]);

	if (loading) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
				<p className="mt-4 text-gray-600">Loading order details...</p>
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center">
				<div className="max-w-md rounded-md bg-red-50 p-4">
					<div className="text-sm text-red-700">{error || "Order not found"}</div>
				</div>
			</div>
		);
	}

	const formatAddress = (address: OrderAddress | null) => {
		if (!address) return null;

		return (
			<div className="text-sm text-gray-600">
				<div className="font-medium">
					{address.firstName} {address.lastName}
				</div>
				{address.companyName && <div>{address.companyName}</div>}
				<div>{address.streetAddress1}</div>
				{address.streetAddress2 && <div>{address.streetAddress2}</div>}
				<div>
					{address.city}
					{address.cityArea && `, ${address.cityArea}`} {address.postalCode}
				</div>
				<div>{address.country.country}</div>
				{address.phone && <div>{address.phone}</div>}
			</div>
		);
	};

	return (
		<div className="mx-auto max-w-4xl">
			{/* Success Header */}
			<div className="mb-8 text-center">
				{" "}
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<Check className="h-8 w-8 text-green-600" />
				</div>
				<h1 className="mb-2 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
				<p className="text-lg text-gray-600">
					Thank you for your purchase. Your order has been successfully placed.
				</p>
			</div>

			{/* Order Details */}
			<div className="mb-8 overflow-hidden rounded-lg bg-white shadow-lg">
				<div className="border-b bg-gray-50 px-6 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg font-semibold text-gray-900">Order #{order.number}</h2>
							<p className="text-sm text-gray-600">
								Placed on {new Date(order.created).toLocaleDateString()}
							</p>
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-gray-900">
								{order.total.gross.currency} {order.total.gross.amount.toFixed(2)}
							</div>
							<div className="text-sm capitalize text-gray-600">
								Status: {order.status.toLowerCase().replace("_", " ")}
							</div>
						</div>
					</div>
				</div>

				{/* Order Items */}
				<div className="px-6 py-4">
					<h3 className="mb-4 text-lg font-medium text-gray-900">Order Items</h3>
					<div className="space-y-4">
						{order.lines.map((line) => (
							<div
								key={line.id}
								className="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0"
							>
								<div className="flex-1">
									<div className="font-medium text-gray-900">{line.productName}</div>
									{line.variantName && <div className="text-sm text-gray-600">{line.variantName}</div>}
									<div className="text-sm text-gray-600">Quantity: {line.quantity}</div>
								</div>
								<div className="text-right">
									<div className="font-medium text-gray-900">
										{line.totalPrice.gross.currency} {line.totalPrice.gross.amount.toFixed(2)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Addresses */}
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{/* Billing Address */}
				{order.billingAddress && (
					<div className="rounded-lg bg-white p-6 shadow">
						<h3 className="mb-4 text-lg font-medium text-gray-900">Billing Address</h3>
						{formatAddress(order.billingAddress)}
					</div>
				)}

				{/* Shipping Address */}
				{order.shippingAddress && (
					<div className="rounded-lg bg-white p-6 shadow">
						<h3 className="mb-4 text-lg font-medium text-gray-900">Shipping Address</h3>
						{formatAddress(order.shippingAddress)}
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="mt-8 text-center">
				<a
					href={`/${channel}`}
					className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
				>
					Continue Shopping
				</a>
			</div>
		</div>
	);
};
