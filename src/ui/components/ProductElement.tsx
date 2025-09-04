import Link from "next/link";
import { Card, CardContent, Typography, Box, Chip, Rating, Stack } from "@mui/material";
import { Store as StoreIcon } from "@mui/icons-material";
import { ProductImageWrapper } from "./ProductImageWrapper";

type ProductElementProps = {
	product: {
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
	};
	showShopName?: boolean;
};

export function ProductElement({ product, showShopName = false }: ProductElementProps) {
	const price = product.defaultVariant?.pricing?.price?.gross;
	const shopName =
		product.channel?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Default Shop";

	return (
		<Box component="li" sx={{ listStyle: "none" }}>
			<Card
				sx={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
					transition: "box-shadow 0.3s ease-in-out",
					"&:hover": {
						boxShadow: 4,
					},
				}}
			>
				<Box
					component={Link}
					href={`/products/${product.slug}`}
					sx={{
						textDecoration: "none",
						color: "inherit",
						display: "block",
						position: "relative",
						aspectRatio: "1",
						overflow: "hidden",
						bgcolor: "grey.100",
						"&:hover img": {
							transform: "scale(1.05)",
						},
					}}
				>
					<Box
						sx={{
							position: "absolute",
							inset: 0,
							height: "100%",
							width: "100%",
							"& img": {
								objectFit: "cover",
								objectPosition: "center",
								transition: "transform 0.3s ease-in-out",
								width: "100%",
								height: "100%",
							},
						}}
					>
						<ProductImageWrapper
							product={{
								name: product.name,
								thumbnail: product.thumbnail,
							}}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
						/>
					</Box>
				</Box>

				<CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
					{/* Shop name and link */}
					{showShopName && product.channel && (
						<Box sx={{ mb: 1 }}>
							<Box
								component={Link}
								href={`/${product.channel}`}
								sx={{
									textDecoration: "none",
									color: "primary.main",
									"&:hover": { color: "primary.dark" },
									display: "flex",
									alignItems: "center",
									gap: 0.5,
									fontSize: 12,
									fontWeight: 500,
								}}
							>
								<StoreIcon sx={{ fontSize: 14 }} />
								<span>{shopName}</span>
							</Box>
						</Box>
					)}

					{/* Product name */}
					<Box
						component={Link}
						href={`/products/${product.slug}`}
						sx={{ textDecoration: "none", color: "inherit" }}
					>
						<Typography
							variant="body2"
							fontWeight={500}
							sx={{
								mb: 1,
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								minHeight: "2.5rem",
								lineHeight: 1.25,
							}}
						>
							{product.name}
						</Typography>
					</Box>

					{/* Category */}
					{product.category && (
						<Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
							in {product.category.name}
						</Typography>
					)}

					{/* Price */}
					{price && (
						<Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
							{price.currency} {price.amount.toFixed(2)}
						</Typography>
					)}

					{/* Badges and Rating */}
					<Box sx={{ mt: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
						<Stack direction="row" alignItems="center" spacing={0.5}>
							<Rating value={4.5} precision={0.5} size="small" readOnly />
							<Typography variant="caption" color="text.secondary">
								(4.5)
							</Typography>
						</Stack>
						<Chip
							label="Fast Delivery"
							size="small"
							color="success"
							variant="outlined"
							sx={{ fontSize: 10 }}
						/>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
