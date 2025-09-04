"use client";

import Link from "next/link";
import { Box, Container, Typography, Card, Button, Avatar, Stack } from "@mui/material";
import {
	CheckCircle as CheckCircleIcon,
	Security as SecurityIcon,
	LocalShipping as LocalShippingIcon,
	ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

import { ProductList } from "@/ui/components/ProductList";
import { HeroSection } from "@/ui/components/HeroSection";
import { FeaturedCategories } from "@/ui/components/FeaturedCategories";

// Client wrapper that contains all the MUI components
export function ClientHomePage({
	products,
	categories,
	isMarketplaceMode = true,
}: {
	products: any[];
	categories: any[];
	isMarketplaceMode?: boolean;
}) {
	// Mock data for demonstration
	const mockCategories = [
		{ id: "1", name: "Electronics", slug: "electronics", description: "Latest gadgets and tech" },
		{ id: "2", name: "Fashion", slug: "fashion", description: "Trendy clothing and accessories" },
		{ id: "3", name: "Food & Drinks", slug: "food-drinks", description: "Local delicacies and beverages" },
		{ id: "4", name: "Home & Garden", slug: "home-garden", description: "Home essentials and decor" },
	];

	return (
		<Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
			{/* Hero Section with Search */}
			<HeroSection />

			{/* Marketplace Stats */}
			<Box component="section" sx={{ py: 8, bgcolor: "white", borderBottom: 1, borderColor: "grey.200" }}>
				<Container maxWidth="lg">
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
							gap: 4,
							textAlign: "center",
						}}
					>
						<Card sx={{ p: 3, boxShadow: 2 }}>
							<Typography variant="h3" fontWeight="bold" color="success.main" sx={{ mb: 1 }}>
								2,500+
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Active Sellers
							</Typography>
						</Card>
						<Card sx={{ p: 3, boxShadow: 2 }}>
							<Typography variant="h3" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
								15,000+
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Products Available
							</Typography>
						</Card>
						<Card sx={{ p: 3, boxShadow: 2 }}>
							<Typography variant="h3" fontWeight="bold" color="warning.main" sx={{ mb: 1 }}>
								50,000+
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Happy Customers
							</Typography>
						</Card>
						<Card sx={{ p: 3, boxShadow: 2 }}>
							<Typography variant="h3" fontWeight="bold" color="error.main" sx={{ mb: 1 }}>
								16 Regions
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Across Ghana
							</Typography>
						</Card>
					</Box>
				</Container>
			</Box>

			{/* Categories Section */}
			<Box component="section" sx={{ py: 8, bgcolor: "grey.50" }}>
				<Container maxWidth="lg">
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
						<Box>
							<Typography variant="h4" component="h2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
								Shop by Category
							</Typography>
							<Typography color="text.secondary">Find exactly what you're looking for</Typography>
						</Box>
						<Button
							variant="outlined"
							endIcon={<ArrowForwardIcon />}
							component={Link}
							href="/categories"
							sx={{ display: { xs: "none", sm: "flex" } }}
						>
							View All Categories
						</Button>
					</Stack>
					<FeaturedCategories categories={categories.length > 0 ? categories : mockCategories} />
				</Container>
			</Box>

			{/* Today's Deals Section */}
			<Box component="section" sx={{ py: 8, bgcolor: "white" }}>
				<Container maxWidth="lg">
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
						<Box>
							<Typography variant="h4" component="h2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
								🔥 Today's Hot Deals
							</Typography>
							<Typography color="text.secondary">Limited time offers from our sellers</Typography>
						</Box>
						<Button
							variant="contained"
							color="error"
							endIcon={<ArrowForwardIcon />}
							component={Link}
							href="/deals"
						>
							View All Deals
						</Button>
					</Stack>
					{products.length > 0 && (
						<ProductList
							products={products.slice(0, 8).map((product) => ({
								id: product.id,
								name: product.name,
								slug: product.slug,
								thumbnail: product.thumbnail,
								defaultVariant: product.pricing?.priceRange?.start
									? {
											pricing: {
												price: {
													gross: product.pricing.priceRange.start.gross,
												},
											},
										}
									: null,
								category: product.category,
								channel: "default-channel",
							}))}
							showShopName={isMarketplaceMode}
						/>
					)}
				</Container>
			</Box>

			{/* Trust and Safety Section */}
			<Box component="section" sx={{ py: 12, bgcolor: "white" }}>
				<Container maxWidth="lg">
					<Box sx={{ textAlign: "center", mb: 8 }}>
						<Typography variant="h4" component="h2" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
							Why Shop on Our Marketplace?
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Your safety and satisfaction are our top priorities
						</Typography>
					</Box>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
							gap: 8,
						}}
					>
						<Box sx={{ textAlign: "center" }}>
							<Avatar
								sx={{
									width: 64,
									height: 64,
									bgcolor: "success.light",
									color: "success.main",
									mx: "auto",
									mb: 3,
								}}
							>
								<CheckCircleIcon sx={{ fontSize: 32 }} />
							</Avatar>
							<Typography variant="h6" component="h3" fontWeight={600} sx={{ mb: 2 }}>
								Verified Sellers
							</Typography>
							<Typography variant="body2" color="text.secondary">
								All sellers are verified and trusted local businesses
							</Typography>
						</Box>
						<Box sx={{ textAlign: "center" }}>
							<Avatar
								sx={{
									width: 64,
									height: 64,
									bgcolor: "info.light",
									color: "info.main",
									mx: "auto",
									mb: 3,
								}}
							>
								<SecurityIcon sx={{ fontSize: 32 }} />
							</Avatar>
							<Typography variant="h6" component="h3" fontWeight={600} sx={{ mb: 2 }}>
								Secure Payments
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Safe and secure payment processing for all transactions
							</Typography>
						</Box>
						<Box sx={{ textAlign: "center" }}>
							<Avatar
								sx={{
									width: 64,
									height: 64,
									bgcolor: "secondary.light",
									color: "secondary.main",
									mx: "auto",
									mb: 3,
								}}
							>
								<LocalShippingIcon sx={{ fontSize: 32 }} />
							</Avatar>
							<Typography variant="h6" component="h3" fontWeight={600} sx={{ mb: 2 }}>
								Fast Delivery
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Quick delivery across Ghana with tracking included
							</Typography>
						</Box>
					</Box>
				</Container>
			</Box>
		</Box>
	);
}
