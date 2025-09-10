"use client";
import { Box } from "@mui/material";
import { ProductElement } from "./ProductElement";

export function ProductList({ products, showShopName = false }: any) {
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
			{products.map((product: any) => (
				<ProductElement key={product.id} product={product} showShopName={showShopName} />
			))}
		</Box>
	);
}
