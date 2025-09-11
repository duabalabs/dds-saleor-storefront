import Link from "next/link";
import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { env } from "@/app/config";
import { type Category } from "@/gql/graphql";

interface FeaturedCategoriesProps {
	categories?: Category[];
}

// Category icon mapping for marketplace mode
const categoryIcons: Record<string, string> = {
	electronics: "📱",
	fashion: "👗",
	"home-garden": "🏠",
	home: "🏠",
	beauty: "💄",
	"food-drinks": "🍽️",
	food: "🍽️",
	books: "📚",
	sports: "⚽",
	automotive: "🚗",
	cars: "🚗",
	// Fallback icons
	default: "🛍️",
};

// Collection icon mapping for single store mode
const collectionIcons: Record<string, string> = {
	"new-arrivals": "✨",
	"best-sellers": "🔥",
	sale: "💸",
	featured: "⭐",
	"on-sale": "💸",
	// Fallback
	default: "🛍️",
};

// Color mapping for MUI theme colors
const colorPalettes = ["primary", "secondary", "success", "warning", "error", "info"];

function getIconForCategory(slug: string, isMarketplace: boolean): string {
	const icons = isMarketplace ? categoryIcons : collectionIcons;
	return icons[slug] || icons.default;
}

function getColorPalette(index: number): string {
	return colorPalettes[index % colorPalettes.length];
}

export function FeaturedCategories({ categories = [] }: FeaturedCategoriesProps) {
	const isMarketplaceMode = env.STORE_MODE === "marketplace";

	const title = isMarketplaceMode ? "Shop by Category" : "Explore Collections";
	const description = isMarketplaceMode
		? "Find exactly what you're looking for across all our seller categories"
		: "Discover our curated collections and find your perfect products";

	// If no categories from GraphQL, show a fallback message
	if (categories.length === 0) {
		return (
			<Box component="section" sx={{ py: 8, bgcolor: "white" }}>
				<Container maxWidth="lg">
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h4" component="h2" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
							{title}
						</Typography>
						<Typography color="text.secondary">
							{isMarketplaceMode
								? "Categories will appear here once sellers add products."
								: "Collections will appear here once products are organized."}
						</Typography>
					</Box>
				</Container>
			</Box>
		);
	}

	return (
		<Box component="section" sx={{ py: 8, bgcolor: "white" }}>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: "center", mb: 6 }}>
					<Typography variant="h4" component="h2" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
						{title}
					</Typography>
					<Typography color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
						{description}
					</Typography>
				</Box>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "repeat(2, 1fr)",
							md: "repeat(3, 1fr)",
							lg: "repeat(4, 1fr)",
						},
						gap: 3,
					}}
				>
					{categories.slice(0, 8).map((category, index) => {
						const icon = getIconForCategory(category.slug, isMarketplaceMode);
						const colorPalette = getColorPalette(index);
						const productCount = category.products?.totalCount || 0;

						return (
							<Card
								key={category.id}
								component={Link}
								href={isMarketplaceMode ? `/categories/${category.slug}` : `/collections/${category.slug}`}
								sx={{
									textDecoration: "none",
									color: "inherit",
									position: "relative",
									overflow: "hidden",
									borderRadius: 2,
									boxShadow: 2,
									transition: "all 0.3s ease-in-out",
									"&:hover": {
										boxShadow: 6,
										transform: "scale(1.02)",
									},
								}}
							>
								{/* Background image if available */}
								{category.backgroundImage && (
									<Box
										sx={{
											position: "absolute",
											inset: 0,
											"& img": {
												width: "100%",
												height: "100%",
												objectFit: "cover",
												opacity: 0.1,
											},
										}}
									>
										<img
											src={category.backgroundImage.url}
											alt={category.backgroundImage.alt || category.name}
										/>
									</Box>
								)}

								<Box
									sx={{
										position: "absolute",
										inset: 0,
										background: `linear-gradient(135deg, ${colorPalette}.light, ${colorPalette}.main)`,
										opacity: 0.05,
										transition: "opacity 0.3s ease-in-out",
										"&:hover": {
											opacity: 0.1,
										},
									}}
								/>

								<CardContent sx={{ position: "relative", textAlign: "center", p: 3 }}>
									<Typography
										sx={{
											fontSize: "2rem",
											mb: 2,
											transition: "transform 0.3s ease-in-out",
											"&:hover": {
												transform: "scale(1.1)",
											},
										}}
									>
										{icon}
									</Typography>
									<Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
										{category.name}
									</Typography>
									{category.description && (
										<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.875rem" }}>
											{category.description}
										</Typography>
									)}
									{productCount > 0 && (
										<Typography variant="caption" color="text.secondary">
											{productCount} {productCount === 1 ? "product" : "products"}
										</Typography>
									)}
								</CardContent>

								{/* Hover overlay */}
								<Box
									sx={{
										position: "absolute",
										inset: 0,
										bgcolor: "common.black",
										opacity: 0,
										transition: "opacity 0.3s ease-in-out",
										"&:hover": {
											opacity: 0.02,
										},
									}}
								/>
							</Card>
						);
					})}
				</Box>

				{categories.length > 8 && (
					<Box sx={{ textAlign: "center", mt: 6 }}>
						<Button
							component={Link}
							href={isMarketplaceMode ? "/categories" : "/collections"}
							endIcon={<ArrowForwardIcon />}
							sx={{
								color: "success.main",
								fontWeight: 500,
								"&:hover": {
									color: "success.dark",
								},
							}}
						>
							{isMarketplaceMode ? "View All Categories" : "View All Collections"}
						</Button>
					</Box>
				)}
			</Container>
		</Box>
	);
}
