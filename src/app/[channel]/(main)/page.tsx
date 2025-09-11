import Link from "next/link";
import { type Product, ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { env, isMarketplaceMode } from "@/app/config";

type ChannelPageProps = {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ChannelPage(props: ChannelPageProps) {
	const params = await props.params;

	// In single store mode, ensure we're only showing the correct channel
	if (!isMarketplaceMode() && params.channel !== env.SINGLE_STORE_CHANNEL) {
		return (
			<div className="min-h-screen bg-white">
				<div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
					<div className="mx-auto max-w-md">
						<div className="mb-4 text-6xl">🚫</div>
						<h2 className="mb-4 text-2xl font-bold text-gray-900">Store Not Available</h2>
						<p className="mb-6 text-gray-600">This store is not available in single store mode.</p>
						<Link
							href={`/${env.SINGLE_STORE_CHANNEL}`}
							className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
						>
							Go to Store
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const isMarketplace = isMarketplaceMode();

	// Get all products for this channel with pagination
	const productsData = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: 24,
			channel: params.channel,
		},
		revalidate: 60,
	});

	const products = productsData.products?.edges.map(({ node: product }) => product) || [];
	const channelName = params.channel.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

	return (
		<div className="min-h-screen">
			{/* Channel Header */}
			<section className="border-b bg-gray-50">
				<div className="mx-auto max-w-7xl px-8 py-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="mb-2 text-3xl font-bold text-gray-900">
								{isMarketplace ? `${channelName} Store` : channelName}
							</h1>
							<p className="text-gray-600">
								{isMarketplace ? "Browse all products from this seller" : "Welcome to our store"}
							</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-gray-500">{products.length} products available</p>
							{isMarketplace && (
								<Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800">
									← Back to Marketplace
								</Link>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Channel Info Bar */}
			<section className="border-b bg-white">
				<div className="mx-auto max-w-7xl px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-6">
							<div className="flex items-center space-x-2">
								<span className="text-green-600">✓</span>
								<span className="text-sm text-gray-600">Verified Seller</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-blue-600">🚚</span>
								<span className="text-sm text-gray-600">Fast Delivery</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-yellow-600">⭐</span>
								<span className="text-sm text-gray-600">Top Rated</span>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<button className="text-sm text-gray-600 hover:text-gray-800">Sort by: Latest</button>
							<button className="text-sm text-gray-600 hover:text-gray-800">Filter</button>
						</div>
					</div>
				</div>
			</section>

			{/* Products Grid */}
			{products.length > 0 ? (
				<section className="mx-auto max-w-7xl p-8">
					<ProductList products={products as Product[]} showShopName={false} />
				</section>
			) : (
				<section className="mx-auto max-w-7xl p-8 py-16 text-center">
					<div className="mx-auto max-w-md">
						<div className="mb-4 text-6xl">📦</div>
						<h2 className="mb-4 text-2xl font-bold text-gray-900">No Products Yet</h2>
						<p className="mb-6 text-gray-600">
							{isMarketplace
								? "This seller hasn't added any products to their store yet."
								: "We're working on adding amazing products for you."}
						</p>
						{isMarketplace && (
							<Link
								href="/"
								className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
							>
								Browse Other Sellers
							</Link>
						)}
					</div>
				</section>
			)}
		</div>
	);
}
