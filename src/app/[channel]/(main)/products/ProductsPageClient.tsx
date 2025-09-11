"use client";

import { useState, useMemo } from "react";
import { ProductList } from "@/ui/components/ProductList";
import { ProductFilters, type ProductFilters as Filters } from "@/ui/components/ProductFilters";
import type { Product } from "@/gql/graphql";

interface ProductsPageClientProps {
	initialProducts: readonly Product[];
	channel: string;
	initialSort?: string;
	initialCategory?: string;
	initialSearchQuery?: string;
}

export function ProductsPageClient({
	initialProducts,
	channel,
	initialSort = "NAME",
	initialCategory,
	initialSearchQuery,
}: ProductsPageClientProps) {
	const [filters, setFilters] = useState<Filters>({
		priceRange: { min: 0, max: 10000 },
		category: initialCategory || "",
		seller: "",
		rating: 0,
		inStock: false,
		fastDelivery: false,
	});

	const [sortBy, setSortBy] = useState(initialSort);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	// Filter and sort products
	const filteredProducts = useMemo(() => {
		let filtered = [...initialProducts];

		// Apply search filter
		if (initialSearchQuery) {
			filtered = filtered.filter(
				(product) =>
					product.name.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
					product.category?.name?.toLowerCase().includes(initialSearchQuery.toLowerCase()),
			);
		}

		// Apply category filter
		if (filters.category) {
			filtered = filtered.filter(
				(product) => product.category?.name?.toLowerCase().includes(filters.category.toLowerCase()),
			);
		}

		// Apply price filter
		filtered = filtered.filter((product) => {
			const price = product.pricing?.priceRange?.start?.gross?.amount;
			if (!price) return true;
			return price >= filters.priceRange.min && price <= filters.priceRange.max;
		});

		// Apply sorting
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "PRICE_LOW_HIGH":
					const priceA = a.pricing?.priceRange?.start?.gross?.amount || 0;
					const priceB = b.pricing?.priceRange?.start?.gross?.amount || 0;
					return priceA - priceB;
				case "PRICE_HIGH_LOW":
					const priceA2 = a.pricing?.priceRange?.start?.gross?.amount || 0;
					const priceB2 = b.pricing?.priceRange?.start?.gross?.amount || 0;
					return priceB2 - priceA2;
				case "NAME":
				default:
					return a.name.localeCompare(b.name);
			}
		});

		return filtered;
	}, [initialProducts, filters, sortBy, initialSearchQuery]);

	return (
		<div className="flex gap-8 p-8">
			{/* Filters Sidebar */}
			<div className="w-64 flex-shrink-0">
				<ProductFilters onFiltersChange={setFilters} channel={channel} />
			</div>

			{/* Main Content */}
			<div className="flex-1">
				{/* Toolbar */}
				<div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
					<p className="text-sm text-gray-600">
						Showing {filteredProducts.length} of {initialProducts.length} products
					</p>

					<div className="flex items-center gap-4">
						{/* Sort Dropdown */}
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="rounded-md border border-gray-300 px-3 py-2 text-sm"
						>
							<option value="NAME">Sort by Name</option>
							<option value="PRICE_LOW_HIGH">Price: Low to High</option>
							<option value="PRICE_HIGH_LOW">Price: High to Low</option>
						</select>

						{/* View Mode Toggle */}
						<div className="flex rounded-md border border-gray-300">
							<button
								onClick={() => setViewMode("grid")}
								className={`px-3 py-2 text-sm ${
									viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
								}`}
							>
								Grid
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={`border-l border-gray-300 px-3 py-2 text-sm ${
									viewMode === "list" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
								}`}
							>
								List
							</button>
						</div>
					</div>
				</div>

				{/* Products Grid/List */}
				{filteredProducts.length > 0 ? (
					<div className={viewMode === "grid" ? "" : "space-y-4"}>
						<ProductList products={filteredProducts} />
					</div>
				) : (
					<div className="py-16 text-center">
						<p className="mb-4 text-lg text-gray-500">No products found matching your criteria</p>
						<button
							onClick={() =>
								setFilters({
									priceRange: { min: 0, max: 10000 },
									category: "",
									seller: "",
									rating: 0,
									inStock: false,
									fastDelivery: false,
								})
							}
							className="text-blue-600 hover:text-blue-800"
						>
							Clear all filters
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
