import Link from "next/link";
import { Box, Container, Typography, TextField, Button, Stack, Chip, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { env, isMarketplaceMode } from "@/app/config";

export function HeroSection() {
	if (isMarketplaceMode()) {
		return (
			<Box
				component="section"
				sx={{
					background: "linear-gradient(135deg, #f0f9ff 0%, #fefce8 50%, #fef2f2 100%)",
					py: 8,
				}}
			>
				<Container maxWidth="lg">
					{/* Main Search and Navigation */}
					<Box sx={{ textAlign: "center", mb: 6 }}>
						<Typography
							variant="h2"
							component="h1"
							fontWeight="bold"
							sx={{
								mb: 3,
								fontSize: { xs: "2rem", md: "3rem" },
								background: "linear-gradient(135deg, #16a34a 0%, #eab308 100%)",
								backgroundClip: "text",
								color: "transparent",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
						>
							{env.MARKETPLACE_NAME}
						</Typography>

						{/* Search Bar */}
						<Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
							<TextField
								fullWidth
								placeholder="Search for products, sellers, or categories..."
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Button
												variant="contained"
												color="success"
												sx={{ mr: -1.5 }}
												startIcon={<SearchIcon />}
											>
												Search
											</Button>
										</InputAdornment>
									),
								}}
								sx={{
									"& .MuiOutlinedInput-root": {
										backgroundColor: "white",
										padding: "12px 14px",
										fontSize: "1.1rem",
										"& fieldset": {
											borderColor: "success.light",
											borderWidth: 2,
										},
										"&:hover fieldset": {
											borderColor: "success.main",
										},
										"&.Mui-focused fieldset": {
											borderColor: "success.main",
										},
									},
								}}
							/>
						</Box>

						{/* Quick Categories */}
						<Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 4, gap: 1 }}>
							{["Electronics", "Fashion", "Food & Drinks", "Home & Garden", "Beauty", "Sports"].map(
								(category) => (
									<Chip
										key={category}
										component={Link}
										href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
										label={category}
										variant="outlined"
										clickable
										sx={{
											bgcolor: "white",
											color: "text.primary",
											"&:hover": {
												borderColor: "success.main",
												color: "success.main",
											},
										}}
									/>
								),
							)}
						</Stack>
					</Box>

					{/* Featured Deals Banner */}
					<Box
						sx={{
							background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
							borderRadius: 2,
							p: 3,
							textAlign: "center",
							color: "white",
							mb: 4,
						}}
					>
						<Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
							🔥 Today&apos;s Hot Deals
						</Typography>
						<Typography sx={{ mb: 2 }}>Up to 70% off on selected items from verified sellers</Typography>
						<Button
							component={Link}
							href="/deals"
							variant="contained"
							sx={{
								bgcolor: "white",
								color: "error.main",
								fontWeight: 600,
								"&:hover": {
									bgcolor: "grey.100",
								},
							}}
						>
							View All Deals
						</Button>
					</Box>

					{/* Trust Indicators */}
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
							gap: 2,
							textAlign: "center",
						}}
					>
						<Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
							<Typography sx={{ fontSize: "1.2rem" }}>🚚</Typography>
							<Typography variant="body2" color="text.secondary">
								Same-day delivery in Accra
							</Typography>
						</Stack>
						<Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
							<Typography sx={{ fontSize: "1.2rem", color: "success.main" }}>✓</Typography>
							<Typography variant="body2" color="text.secondary">
								Verified local sellers
							</Typography>
						</Stack>
						<Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
							<Typography sx={{ fontSize: "1.2rem" }}>🔒</Typography>
							<Typography variant="body2" color="text.secondary">
								Secure mobile money
							</Typography>
						</Stack>
						<Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
							<Typography sx={{ fontSize: "1.2rem" }}>🎧</Typography>
							<Typography variant="body2" color="text.secondary">
								24/7 local support
							</Typography>
						</Stack>
					</Box>
				</Container>
			</Box>
		);
	}

	// Single store mode hero
	return (
		<Box
			component="section"
			sx={{
				background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
				py: 10,
				color: "white",
			}}
		>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: "center" }}>
					<Typography
						variant="h2"
						component="h1"
						fontWeight="bold"
						sx={{
							fontSize: { xs: "2.5rem", sm: "3.5rem" },
							mb: 3,
							letterSpacing: "-0.025em",
						}}
					>
						Welcome to {env.SINGLE_STORE_NAME}
					</Typography>
					<Typography
						variant="h6"
						sx={{
							color: "rgba(255, 255, 255, 0.8)",
							maxWidth: 600,
							mx: "auto",
							mb: 4,
							lineHeight: 1.6,
						}}
					>
						Discover our amazing collection of products. Quality items at great prices, delivered right to
						your door.
					</Typography>
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={2}
						justifyContent="center"
						alignItems="center"
					>
						<Button
							component={Link}
							href="/products"
							variant="contained"
							size="large"
							sx={{
								bgcolor: "white",
								color: "primary.main",
								fontWeight: 600,
								px: 4,
								py: 1.5,
								fontSize: "1.1rem",
								"&:hover": {
									bgcolor: "grey.100",
								},
							}}
						>
							Shop Collection
						</Button>
						<Button
							component={Link}
							href="/about"
							variant="outlined"
							size="large"
							sx={{
								borderColor: "white",
								color: "white",
								fontWeight: 600,
								px: 4,
								py: 1.5,
								fontSize: "1.1rem",
								borderWidth: 2,
								"&:hover": {
									bgcolor: "white",
									color: "primary.main",
									borderColor: "white",
								},
							}}
						>
							Learn More
						</Button>
					</Stack>
				</Box>
			</Container>
		</Box>
	);
}
