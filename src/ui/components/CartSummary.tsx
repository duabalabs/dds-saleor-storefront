"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface CartItem {
	id: string;
	quantity: number;
	product: {
		name: string;
		thumbnail?: { url: string } | null;
	};
	variant: {
		pricing?: {
			price?: {
				gross: {
					amount: number;
					currency: string;
				};
			} | null;
		} | null;
	};
}

export function CartSummary() {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	// Mock cart data for now - in real app, this would come from context/state management
	useEffect(() => {
		// This would typically fetch from localStorage, context, or API
		setCartItems([]);
	}, []);

	const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	const totalAmount = cartItems.reduce((sum, item) => {
		const price = item.variant.pricing?.price?.gross;
		return sum + (price ? price.amount * item.quantity : 0);
	}, 0);

	const currency = cartItems[0]?.variant.pricing?.price?.gross.currency || "GHS";

	return (
		<div className="relative">
			{/* Cart Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative flex items-center space-x-2 text-gray-700 transition-colors hover:text-gray-900"
			>
				<div className="relative">
					<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h9.9M17 13l1.1 5M9 19.5a.5.5 0 11-1 0 .5.5 0 011 0zM20 19.5a.5.5 0 11-1 0 .5.5 0 011 0z"
						/>
					</svg>
					{totalItems > 0 && (
						<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
							{totalItems > 99 ? "99+" : totalItems}
						</span>
					)}
				</div>
				<div className="hidden md:block">
					<div className="text-sm font-medium">Cart</div>
					{totalItems > 0 && (
						<div className="text-xs text-gray-500">
							{currency} {totalAmount.toFixed(2)}
						</div>
					)}
				</div>
			</button>

			{/* Cart Dropdown */}
			{isOpen && (
				<div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
					{cartItems.length === 0 ? (
						// Empty Cart
						<div className="p-6 text-center">
							<div className="mb-4 text-4xl">🛒</div>
							<h3 className="mb-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
							<p className="mb-4 text-gray-500">Add some products to get started!</p>
							<Link
								href="/products"
								className="inline-block rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
								onClick={() => setIsOpen(false)}
							>
								Start Shopping
							</Link>
						</div>
					) : (
						// Cart with Items
						<div className="max-h-96 overflow-y-auto">
							<div className="border-b p-4">
								<h3 className="text-lg font-medium text-gray-900">Shopping Cart ({totalItems} items)</h3>
							</div>

							<div className="space-y-4 p-4">
								{cartItems.map((item) => (
									<div key={item.id} className="flex items-center space-x-3">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
											{item.product.thumbnail?.url ? (
												<img
													src={item.product.thumbnail.url}
													alt={item.product.name}
													className="h-full w-full rounded-lg object-cover"
												/>
											) : (
												<span className="text-gray-400">📦</span>
											)}
										</div>
										<div className="flex-1">
											<h4 className="line-clamp-1 text-sm font-medium text-gray-900">{item.product.name}</h4>
											<div className="mt-1 flex items-center justify-between">
												<span className="text-sm text-gray-500">Qty: {item.quantity}</span>
												<span className="text-sm font-medium text-gray-900">
													{currency}{" "}
													{((item.variant.pricing?.price?.gross.amount || 0) * item.quantity).toFixed(2)}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>

							<div className="border-t bg-gray-50 p-4">
								<div className="mb-4 flex items-center justify-between">
									<span className="text-lg font-medium text-gray-900">Total:</span>
									<span className="text-lg font-bold text-gray-900">
										{currency} {totalAmount.toFixed(2)}
									</span>
								</div>
								<div className="space-y-2">
									<Link
										href="/cart"
										className="block w-full rounded-lg bg-gray-100 px-4 py-2 text-center font-medium text-gray-900 transition-colors hover:bg-gray-200"
										onClick={() => setIsOpen(false)}
									>
										View Cart
									</Link>
									<Link
										href="/checkout"
										className="block w-full rounded-lg bg-green-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-green-700"
										onClick={() => setIsOpen(false)}
									>
										Checkout
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
