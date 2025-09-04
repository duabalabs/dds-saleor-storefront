import { notFound } from "next/navigation";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductsPerPage } from "@/app/config";

export const metadata = {
	title: "All Products · Sellub Marketplace",
	description:
		"Browse all products from trusted local sellers. Find electronics, fashion, home goods and more.",
};

export default async function Page(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor: string | string[] | undefined;
		sort: string | string[] | undefined;
		category: string | string[] | undefined;
		q: string | string[] | undefined;
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
	const sort = typeof searchParams.sort === "string" ? searchParams.sort : "NAME";
	const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
	const searchQuery = typeof searchParams.q === "string" ? searchParams.q : undefined;

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: ProductsPerPage,
			after: cursor,
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	const newSearchParams = new URLSearchParams({
		...(products.pageInfo.endCursor && { cursor: products.pageInfo.endCursor }),
		...(sort && { sort }),
		...(category && { category }),
		...(searchQuery && { q: searchQuery }),
	});

	return (
		<div className="mx-auto max-w-7xl">
			{/* Page Header */}
			<div className="border-b border-gray-200 px-8 py-6">
				<h1 className="text-2xl font-bold text-gray-900">
					{searchQuery ? `Search results for "${searchQuery}"` : "All Products"}
				</h1>
				<p className="mt-1 text-gray-600">{products.edges.length} products available</p>
			</div>

			{/* Enhanced Product Grid */}
			<div className="p-8">
				{products.edges.length > 0 ? (
					<ProductList products={products.edges.map((e) => e.node)} />
				) : (
					<div className="py-16 text-center">
						<p className="mb-4 text-lg text-gray-500">No products found</p>
						<p className="text-sm text-gray-400">
							Connect your Saleor backend and add products to see them here.
						</p>
					</div>
				)}
			</div>

			{/* Pagination */}
			<div className="px-8 py-8">
				<Pagination
					pageInfo={{
						...products.pageInfo,
						basePathname: `/products`,
						urlSearchParams: newSearchParams,
					}}
				/>
			</div>
		</div>
	);
}
