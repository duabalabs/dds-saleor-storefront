import Link from "next/link";

interface Channel {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

interface ShopDirectoryProps {
	channels: Channel[];
}

export function ShopDirectory({ channels }: ShopDirectoryProps) {
	if (channels.length === 0) {
		return (
			<section className="bg-white py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="mb-4 text-3xl font-bold text-gray-900">Shop Directory</h2>
						<p className="text-gray-600">Local shops will appear here once they join our marketplace.</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-white py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-3xl font-bold text-gray-900">Featured Shops</h2>
					<p className="mx-auto max-w-2xl text-gray-600">
						Discover amazing products from verified sellers across Ghana. Each shop offers unique products
						with quality guarantee.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{channels.slice(0, 8).map((channel) => (
						<Link
							key={channel.id}
							href={`/${channel.slug}`}
							className="group rounded-xl border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
						>
							{/* Shop Icon */}
							<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-yellow-100 transition-all group-hover:from-green-200 group-hover:to-yellow-200">
								<span className="text-3xl">🏪</span>
							</div>

							{/* Shop Info */}
							<h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-green-700">
								{channel.name}
							</h3>
							<p className="mb-3 text-sm text-gray-600">Verified Seller</p>

							{/* Ratings */}
							<div className="mb-3 flex items-center justify-center space-x-1 text-yellow-500">
								{[...Array(5)].map((_, i) => (
									<span key={i} className="text-sm">
										⭐
									</span>
								))}
								<span className="ml-1 text-xs text-gray-500">(4.8)</span>
							</div>

							{/* Badges */}
							<div className="space-y-2">
								<span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
									Fast Delivery
								</span>
								<div className="text-xs text-gray-500">Join thousands of happy customers</div>
							</div>
						</Link>
					))}
				</div>

				{channels.length > 8 && (
					<div className="mt-12 text-center">
						<Link
							href="/shops"
							className="inline-flex items-center rounded-lg bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700"
						>
							View All Shops
							<svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
