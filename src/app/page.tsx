import { redirect } from "next/navigation";
import Link from "next/link";

import { env, isMarketplaceMode } from "./config";
import { ClientHomePage } from "@/components/ClientHomePage";
import { ProductListPaginatedDocument, ChannelsListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export const metadata = {
	title: `${env.MARKETPLACE_NAME} - Shop from Local Sellers in Ghana`,
	description:
		"Discover amazing products from verified local sellers across Ghana. Support local businesses and find everything you need in one place - from electronics to fashion, food to home goods.",
	keywords: "Ghana marketplace, local sellers, online shopping Ghana, Ghanaian products, local business",
};

export default async function HomePage() {
	// If single store mode, redirect to that specific channel
	if (!isMarketplaceMode()) {
		redirect(`/${env.SINGLE_STORE_CHANNEL}`);
	}

	try {
		// Fetch channels first
		const channelsData = await executeGraphQL(ChannelsListDocument, {
			withAuth: true,
		});
		console.log("Channels Data:", channelsData);
		const channels = channelsData.channels || [];
		const channelSlug = channels[0]?.slug || "default-channel"; // Use the first channel or fallback

		// Get products
		const productsData = await executeGraphQL(ProductListPaginatedDocument, {
			variables: {
				first: 16,
				channel: channelSlug,
			},
			revalidate: 60,
			withAuth: false,
		});
		const products = productsData.products?.edges.map(({ node: product }) => product) || [];

		// Get categories from GraphQL
		const categoriesData: any = [];
		const categories =
			categoriesData.categories?.edges.map(({ node }: any) => ({
				id: node.id,
				name: node.name,
				slug: node.slug,
				description: node.description,
				products: { totalCount: node.products?.totalCount || 0 },
			})) || [];

		return <ClientHomePage products={products} categories={categories} isMarketplaceMode={true} />;
	} catch (error) {
		console.error("Error loading homepage data:", error);

		// Fallback UI when GraphQL fails
		return (
			<div className="min-h-screen">
				<section className="py-16">
					<div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
						<div className="mx-auto max-w-md">
							<div className="mb-4 text-6xl">⚠️</div>
							<h2 className="mb-4 text-2xl font-bold text-gray-900">Service Temporarily Unavailable</h2>
							<p className="mb-6 text-gray-600">
								We&apos;re experiencing some technical difficulties. Please try again later.
							</p>
							<Link
								href="/"
								className="inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
							>
								Refresh Page
							</Link>
						</div>
					</div>
				</section>
			</div>
		);
	}
}
