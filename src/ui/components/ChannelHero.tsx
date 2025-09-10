import Link from "next/link";

interface ChannelHeroProps {
	channel: string;
}

export async function ChannelHero({ channel }: ChannelHeroProps) {
	// In a real implementation, you'd fetch channel-specific data
	// This is a placeholder for seller/channel information

	const isMainMarketplace = channel === "default-channel";

	if (isMainMarketplace) {
		return (
			<section className="bg-gradient-to-r from-green-600 to-yellow-500 py-16 text-white">
				<div className="mx-auto max-w-7xl px-8">
					<div className="text-center">
						<h1 className="mb-4 text-4xl font-bold md:text-6xl">Welcome to Sellub Marketplace</h1>
						<p className="mb-8 text-xl opacity-90 md:text-2xl">
							Discover amazing products from local sellers
						</p>
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Link
								href="/products"
								className="rounded-lg bg-white px-8 py-3 font-semibold text-green-600 transition-colors hover:bg-gray-100"
							>
								Shop All Products
							</Link>
							<Link
								href="/sellers"
								className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-green-600"
							>
								Browse Sellers
							</Link>
						</div>
					</div>
				</div>
			</section>
		);
	}

	// Channel-specific hero (for individual sellers)
	return (
		<section className="bg-gray-900 py-12 text-white">
			<div className="mx-auto max-w-7xl px-8">
				<div className="text-center">
					<h1 className="mb-4 text-3xl font-bold capitalize md:text-5xl">
						{channel.replace("-", " ")} Store
					</h1>
					<p className="mb-6 text-lg opacity-90 md:text-xl">Quality products with trusted service</p>
					<div className="flex items-center justify-center gap-4 text-sm">
						<span className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-green-400"></span>
							Active Seller
						</span>
						<span>•</span>
						<span>Shipping across Africa</span>
						<span>•</span>
						<span>⭐ 4.8 Rating</span>
					</div>
				</div>
			</div>
		</section>
	);
}
