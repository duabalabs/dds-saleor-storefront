interface MarketplaceStatsProps {
	shopCount: number;
	productCount: number;
	categoryCount: number;
}

export function MarketplaceStats({ shopCount, productCount, categoryCount }: MarketplaceStatsProps) {
	const stats = [
		{
			icon: "🏪",
			value: `${shopCount}+`,
			label: "Verified Shops",
			description: "Trusted local businesses",
		},
		{
			icon: "📦",
			value: `${productCount}+`,
			label: "Products",
			description: "Quality items available",
		},
		{
			icon: "🛍️",
			value: `${categoryCount}+`,
			label: "Categories",
			description: "Different product types",
		},
		{
			icon: "🇬🇭",
			value: "16",
			label: "Regions",
			description: "Across Ghana",
		},
		{
			icon: "⭐",
			value: "4.8",
			label: "Rating",
			description: "Customer satisfaction",
		},
		{
			icon: "🚚",
			value: "24h",
			label: "Delivery",
			description: "Average delivery time",
		},
	];

	return (
		<section className="bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-3xl font-bold text-gray-900">Ghana&apos;s Leading Marketplace</h2>
					<p className="mx-auto max-w-2xl text-gray-600">
						Connecting local businesses with customers across Ghana. Supporting economic growth and community
						development.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
					{stats.map((stat, index) => (
						<div key={index} className="text-center">
							<div className="mb-3 text-4xl">{stat.icon}</div>
							<div className="mb-1 text-2xl font-bold text-gray-900">{stat.value}</div>
							<div className="mb-1 text-sm font-medium text-gray-900">{stat.label}</div>
							<div className="text-xs text-gray-600">{stat.description}</div>
						</div>
					))}
				</div>

				{/* Quick facts */}
				<div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
					<div className="text-center">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="mb-2 text-3xl text-green-600">🔒</div>
							<h3 className="mb-2 font-semibold text-gray-900">Secure Payments</h3>
							<p className="text-sm text-gray-600">
								Safe and secure payment processing with multiple options
							</p>
						</div>
					</div>
					<div className="text-center">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="mb-2 text-3xl text-blue-600">📞</div>
							<h3 className="mb-2 font-semibold text-gray-900">24/7 Support</h3>
							<p className="text-sm text-gray-600">
								Customer support available in English and local languages
							</p>
						</div>
					</div>
					<div className="text-center">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="mb-2 text-3xl text-yellow-600">🏆</div>
							<h3 className="mb-2 font-semibold text-gray-900">Quality Guarantee</h3>
							<p className="text-sm text-gray-600">All products verified for quality and authenticity</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
