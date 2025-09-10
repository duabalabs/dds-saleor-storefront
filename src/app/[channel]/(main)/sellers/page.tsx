import Link from "next/link";

export const metadata = {
	title: "Browse Sellers · Sellub Marketplace",
	description:
		"Discover trusted sellers and local businesses across Africa. Find quality products from verified merchants.",
};

export default async function SellersPage() {

	// In a real implementation, you'd have a sellers query
	// For now, we'll use sample data representing channels as sellers
	const sampleSellers = [
		{
			id: "1",
			name: "Tech Ghana Store",
			slug: "tech-ghana",
			description: "Your one-stop shop for electronics and gadgets",
			rating: 4.8,
			totalProducts: 150,
			image: "/api/placeholder/300/200",
			verified: true,
			location: "Accra, Ghana",
			established: "2020",
		},
		{
			id: "2",
			name: "Fashion Forward GH",
			slug: "fashion-forward",
			description: "Latest fashion trends and traditional wear",
			rating: 4.6,
			totalProducts: 89,
			image: "/api/placeholder/300/200",
			verified: true,
			location: "Kumasi, Ghana",
			established: "2019",
		},
		{
			id: "3",
			name: "Home & Garden Plus",
			slug: "home-garden",
			description: "Everything for your home and garden needs",
			rating: 4.7,
			totalProducts: 234,
			image: "/api/placeholder/300/200",
			verified: true,
			location: "Takoradi, Ghana",
			established: "2018",
		},
		{
			id: "4",
			name: "Beauty Essentials GH",
			slug: "beauty-essentials",
			description: "Premium beauty products and cosmetics",
			rating: 4.9,
			totalProducts: 67,
			image: "/api/placeholder/300/200",
			verified: true,
			location: "Tamale, Ghana",
			established: "2021",
		},
	];

	return (
		<div className="mx-auto max-w-7xl p-8">
			{/* Page Header */}
			<div className="mb-12 text-center">
				<h1 className="mb-4 text-3xl font-bold text-gray-900">Browse Trusted Sellers</h1>
				<p className="mx-auto max-w-2xl text-lg text-gray-600">
					Discover amazing local businesses and verified sellers across Ghana. Support local entrepreneurs and
					find quality products.
				</p>
			</div>

			{/* Sellers Grid */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{sampleSellers.map((seller) => (
					<Link
						key={seller.id}
						href={`/${seller.slug}`}
						className="group block rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
					>
						{/* Seller Image */}
						<div className="aspect-video rounded-t-lg bg-gradient-to-br from-blue-400 to-purple-500"></div>

						{/* Seller Info */}
						<div className="p-6">
							<div className="mb-2 flex items-start justify-between">
								<h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
									{seller.name}
								</h3>
								{seller.verified && (
									<span className="flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
										✓ Verified
									</span>
								)}
							</div>

							<p className="mb-3 line-clamp-2 text-sm text-gray-600">{seller.description}</p>

							{/* Rating */}
							<div className="mb-2 flex items-center">
								<div className="flex text-sm text-yellow-400">
									{"★".repeat(Math.floor(seller.rating))}
									{"☆".repeat(5 - Math.floor(seller.rating))}
								</div>
								<span className="ml-2 text-sm text-gray-600">
									{seller.rating} ({Math.floor(seller.rating * 100)} reviews)
								</span>
							</div>

							{/* Stats */}
							<div className="space-y-1 text-xs text-gray-500">
								<p>📍 {seller.location}</p>
								<p>📦 {seller.totalProducts} products</p>
								<p>📅 Since {seller.established}</p>
							</div>

							{/* CTA */}
							<div className="mt-4 border-t border-gray-100 pt-4">
								<span className="text-sm font-medium text-blue-600 group-hover:text-blue-800">
									Visit Store →
								</span>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Call to Action for New Sellers */}
			<div className="mt-16 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center text-white">
				<h2 className="mb-4 text-2xl font-bold">Want to Become a Seller?</h2>
				<p className="mb-6 text-lg opacity-90">
					Join thousands of Ghanaian entrepreneurs selling on our platform
				</p>
				<button className="rounded-lg bg-white px-8 py-3 font-semibold text-green-600 transition-colors hover:bg-gray-100">
					Start Selling Today
				</button>
			</div>
		</div>
	);
}
