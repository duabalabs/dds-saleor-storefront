import { useState } from "react";

interface ProductFiltersProps {
	onFiltersChange: (filters: ProductFilters) => void;
	channel: string;
}

export interface ProductFilters {
	priceRange: { min: number; max: number };
	category: string;
	seller: string;
	rating: number;
	inStock: boolean;
	fastDelivery: boolean;
}

export function ProductFilters({ onFiltersChange, channel }: ProductFiltersProps) {
	const [filters, setFilters] = useState<ProductFilters>({
		priceRange: { min: 0, max: 10000 },
		category: "",
		seller: "",
		rating: 0,
		inStock: false,
		fastDelivery: false,
	});

	const handleFilterChange = (key: keyof ProductFilters, value: any) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		onFiltersChange(newFilters);
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6">
			<h3 className="mb-4 text-lg font-semibold">Filters</h3>

			{/* Price Range */}
			<div className="mb-6">
				<label className="mb-2 block text-sm font-medium text-gray-700">Price Range (GHS)</label>
				<div className="flex gap-2">
					<input
						type="number"
						placeholder="Min"
						value={filters.priceRange.min}
						onChange={(e) =>
							handleFilterChange("priceRange", {
								...filters.priceRange,
								min: Number(e.target.value),
							})
						}
						className="w-full rounded-md border border-gray-300 px-3 py-2"
					/>
					<input
						type="number"
						placeholder="Max"
						value={filters.priceRange.max}
						onChange={(e) =>
							handleFilterChange("priceRange", {
								...filters.priceRange,
								max: Number(e.target.value),
							})
						}
						className="w-full rounded-md border border-gray-300 px-3 py-2"
					/>
				</div>
			</div>

			{/* Category */}
			<div className="mb-6">
				<label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
				<select
					value={filters.category}
					onChange={(e) => handleFilterChange("category", e.target.value)}
					className="w-full rounded-md border border-gray-300 px-3 py-2"
				>
					<option value="">All Categories</option>
					<option value="electronics">Electronics</option>
					<option value="fashion">Fashion & Clothing</option>
					<option value="home">Home & Garden</option>
					<option value="beauty">Beauty & Health</option>
					<option value="food">Food & Beverages</option>
				</select>
			</div>

			{/* Rating */}
			<div className="mb-6">
				<label className="mb-2 block text-sm font-medium text-gray-700">Minimum Rating</label>
				<div className="space-y-2">
					{[4, 3, 2, 1].map((rating) => (
						<label key={rating} className="flex items-center">
							<input
								type="radio"
								name="rating"
								value={rating}
								checked={filters.rating === rating}
								onChange={(e) => handleFilterChange("rating", Number(e.target.value))}
								className="mr-2"
							/>
							<span className="flex text-yellow-400">
								{"★".repeat(rating)}
								{"☆".repeat(5 - rating)}
							</span>
							<span className="ml-1 text-sm text-gray-600">& up</span>
						</label>
					))}
				</div>
			</div>

			{/* Quick Filters */}
			<div className="space-y-3">
				<h4 className="text-sm font-medium text-gray-700">Quick Filters</h4>

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={filters.inStock}
						onChange={(e) => handleFilterChange("inStock", e.target.checked)}
						className="mr-2"
					/>
					<span className="text-sm">In Stock Only</span>
				</label>

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={filters.fastDelivery}
						onChange={(e) => handleFilterChange("fastDelivery", e.target.checked)}
						className="mr-2"
					/>
					<span className="text-sm">🚚 Fast Delivery</span>
				</label>
			</div>

			{/* Clear Filters */}
			<button
				onClick={() => {
					const defaultFilters: ProductFilters = {
						priceRange: { min: 0, max: 10000 },
						category: "",
						seller: "",
						rating: 0,
						inStock: false,
						fastDelivery: false,
					};
					setFilters(defaultFilters);
					onFiltersChange(defaultFilters);
				}}
				className="mt-4 w-full rounded-md border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50"
			>
				Clear All Filters
			</button>
		</div>
	);
}
