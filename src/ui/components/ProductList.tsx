"use client";
import { Box } from "@mui/material";
import { ProductElement } from "./ProductElement";

type ProductListProps = {
	products: Array<{
		id: string;
		name: string;
		slug: string;
		thumbnail?: { url: string; alt?: string | null } | null;
		defaultVariant?: {
			pricing?: {
				price?: {
					gross: {
						amount: number;
						currency: string;
					};
				} | null;
			} | null;
		} | null;
		channel?: string;
		category?: { name: string; slug: string } | null;
	}>;
	showShopName?: boolean;
};

export function ProductList({ products, showShopName = false }: ProductListProps) {
	return (
		<Box
			component="ul"
			sx={{
				display: "grid",
				gridTemplateColumns: {
					xs: "1fr",
					sm: "repeat(2, 1fr)",
					lg: "repeat(3, 1fr)",
					xl: "repeat(4, 1fr)",
				},
				gap: 4,
				listStyle: "none",
				p: 0,
				m: 0,
			}}
			data-testid="ProductList"
		>
			{products.map((product) => (
				<ProductElement key={product.id} product={product} showShopName={showShopName} />
			))}
		</Box>
	);
}
