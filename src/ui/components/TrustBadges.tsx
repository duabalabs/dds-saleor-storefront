export function TrustBadges() {
	const badges = [
		{
			icon: "✓",
			text: "Verified Sellers",
			color: "text-green-600",
		},
		{
			icon: "🚚",
			text: "Fast Delivery",
			color: "text-blue-600",
		},
		{
			icon: "🔒",
			text: "Secure Payments",
			color: "text-purple-600",
		},
		{
			icon: "📞",
			text: "Local Support",
			color: "text-orange-600",
		},
		{
			icon: "🏆",
			text: "Quality Guarantee",
			color: "text-yellow-600",
		},
	];

	return (
		<section className="border-b bg-white py-8">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-center justify-center gap-8 text-sm">
					{badges.map((badge, index) => (
						<div key={index} className="flex items-center space-x-2">
							<span className={`${badge.color} font-bold`}>{badge.icon}</span>
							<span className="font-medium text-gray-700">{badge.text}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
