"use client";

import { useState } from "react";
import {
	Box,
	Container,
	Typography,
	Card,
	CardContent,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Chip,
	Avatar,
	Stack,
	CircularProgress,
} from "@mui/material";
import {
	Close as CloseIcon,
	Email as EmailIcon,
	CheckCircle as CheckCircleIcon,
	LocalShipping as LocalShippingIcon,
	Analytics as AnalyticsIcon,
	Security as SecurityIcon,
	LocationOn as LocationOnIcon,
	Support as SupportIcon,
	Factory as FactoryIcon,
	Storefront as StorefrontIcon,
} from "@mui/icons-material";

type ModalType = "seller" | "supplier" | "forwarder" | null;

interface FormData {
	name: string;
	email: string;
	phone: string;
	businessName: string;
	businessType: string;
	location: string;
	description: string;
}

export default function AboutPage() {
	const [activeModal, setActiveModal] = useState<ModalType>(null);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		businessName: "",
		businessType: "",
		location: "",
		description: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (field: string) => (event: { target: { value: string } }) => {
		setFormData((prev) => ({ ...prev, [field]: event.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent, type: string) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const emailBody = `
New ${type} Application:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Business Name: ${formData.businessName}
Business Type: ${formData.businessType}
Location: ${formData.location}
Description: ${formData.description}

Application Type: ${type}
Submitted: ${new Date().toLocaleString()}
      `;

			console.log("Sending email to contact@sellub.com:", emailBody);

			await new Promise((resolve) => setTimeout(resolve, 1000));

			setSubmitSuccess(true);
			setTimeout(() => {
				setActiveModal(null);
				setSubmitSuccess(false);
				setFormData({
					name: "",
					email: "",
					phone: "",
					businessName: "",
					businessType: "",
					location: "",
					description: "",
				});
			}, 2000);
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const closeModal = () => {
		setActiveModal(null);
		setFormData({
			name: "",
			email: "",
			phone: "",
			businessName: "",
			businessType: "",
			location: "",
			description: "",
		});
	};

	const getModalTitle = (type: ModalType) => {
		switch (type) {
			case "seller":
				return "Become a Distributor";
			case "supplier":
				return "Join as Supplier";
			case "forwarder":
				return "Partner with Logistics";
			default:
				return "";
		}
	};

	const getModalType = (type: ModalType) => {
		switch (type) {
			case "seller":
				return "Distributor";
			case "supplier":
				return "Supplier";
			case "forwarder":
				return "Logistics Partner";
			default:
				return "";
		}
	};

	return (
		<Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
			{/* Hero Section */}
			<Box
				sx={{
					background: "linear-gradient(135deg, #28a745 0%, #ffc107 50%, #dc3545 100%)",
					color: "white",
					py: { xs: 8, md: 12 },
					position: "relative",
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						bgcolor: "rgba(0,0,0,0.2)",
					}}
				/>
				<Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
					<Box textAlign="center">
						<Typography
							variant="h1"
							component="h1"
							sx={{
								fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
								fontWeight: 700,
								mb: 3,
								textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
							}}
						>
							About{" "}
							<Box component="span" sx={{ fontStyle: "italic" }}>
								Sellub
							</Box>
						</Typography>
						<Typography
							variant="h5"
							sx={{
								maxWidth: 800,
								mx: "auto",
								opacity: 0.95,
								fontWeight: 400,
								lineHeight: 1.5,
							}}
						>
							Connecting Ghana&apos;s business ecosystem through innovative supply chain technology
						</Typography>
					</Box>
				</Container>
			</Box>

			{/* Main Content */}
			<Container maxWidth="lg" sx={{ py: 8 }}>
				{/* Introduction Section */}
				<Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4, mb: 8 }}>
					<Box sx={{ flex: 1 }}>
						<Card sx={{ height: "100%", p: 3 }}>
							<CardContent>
								<Typography variant="h3" component="h2" gutterBottom color="primary">
									Revolutionizing Ghana&apos;s Supply Chain
								</Typography>
								<Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.7 }}>
									Sellub operates on the cutting-edge{" "}
									<Typography component="span" sx={{ fontWeight: 600, color: "primary.main" }}>
										DDS (Duaba Delivery System)
									</Typography>
									, a comprehensive supply chain platform that optimizes the movement of goods from
									manufacturers to customers while providing complete visibility through trackable updates.
								</Typography>
								<Typography variant="body1" sx={{ lineHeight: 1.7 }}>
									We bridge the gap between local distributors, suppliers, and end customers, creating a
									streamlined marketplace that empowers Ghanaian businesses to reach their full potential.
								</Typography>
							</CardContent>
						</Card>
					</Box>

					<Box sx={{ flex: 1 }}>
						<Card
							sx={{
								height: "100%",
								background: "linear-gradient(135deg, #e8f5e8 0%, #fff3cd 100%)",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								p: 4,
							}}
						>
							<LocalShippingIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
							<Typography variant="h4" component="h3" gutterBottom fontWeight={600}>
								DDS Platform
							</Typography>
							<Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
								<Chip label="Real-time tracking" color="primary" size="small" />
								<Chip label="Supply optimization" color="secondary" size="small" />
								<Chip label="End-to-end visibility" color="error" size="small" />
							</Stack>
						</Card>
					</Box>
				</Box>

				{/* How It Works Section */}
				<Card sx={{ p: 4, mb: 8 }}>
					<Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
						How Sellub Works
					</Typography>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
							gap: 4,
						}}
					>
						{[
							{
								icon: <FactoryIcon sx={{ fontSize: 48 }} />,
								title: "Suppliers Connect",
								description:
									"Manufacturers and suppliers join our platform to showcase their products and connect with distributors across Ghana.",
								color: "primary.main",
							},
							{
								icon: <StorefrontIcon sx={{ fontSize: 48 }} />,
								title: "Distributors Sell",
								description:
									"Local distributors get access to quality products and sell directly to customers through their dedicated storefronts.",
								color: "secondary.main",
							},
							{
								icon: <LocalShippingIcon sx={{ fontSize: 48 }} />,
								title: "Seamless Delivery",
								description:
									"Our logistics partners ensure fast, reliable delivery with full tracking from warehouse to customer doorstep.",
								color: "error.main",
							},
						].map((step, index) => (
							<Box key={index} textAlign="center">
								<Avatar
									sx={{
										width: 80,
										height: 80,
										bgcolor: `${step.color}20`,
										color: step.color,
										mx: "auto",
										mb: 3,
										transition: "transform 0.2s",
										"&:hover": {
											transform: "scale(1.1)",
										},
									}}
								>
									{step.icon}
								</Avatar>
								<Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
									{step.title}
								</Typography>
								<Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
									{step.description}
								</Typography>
							</Box>
						))}
					</Box>
				</Card>

				{/* Call to Action Section */}
				<Card
					sx={{
						background: "linear-gradient(135deg, #28a745 0%, #ffc107 100%)",
						color: "white",
						p: { xs: 4, md: 6 },
						textAlign: "center",
						mb: 8,
					}}
				>
					<Typography variant="h3" component="h2" gutterBottom fontWeight={600}>
						Join the Sellub Ecosystem
					</Typography>
					<Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
						Whether you&apos;re a supplier, distributor, or logistics partner, there&apos;s a place for you in
						our growing network.
					</Typography>
					<Stack
						direction={{ xs: "column", md: "row" }}
						spacing={2}
						justifyContent="center"
						alignItems="center"
					>
						<Button
							variant="contained"
							size="large"
							onClick={() => setActiveModal("seller")}
							sx={{
								bgcolor: "white",
								color: "primary.main",
								minWidth: 200,
								"&:hover": {
									bgcolor: "grey.100",
								},
							}}
						>
							Become a Distributor
						</Button>
						<Button
							variant="contained"
							size="large"
							onClick={() => setActiveModal("supplier")}
							sx={{
								bgcolor: "white",
								color: "primary.main",
								minWidth: 200,
								"&:hover": {
									bgcolor: "grey.100",
								},
							}}
						>
							Join as Supplier
						</Button>
						<Button
							variant="contained"
							size="large"
							onClick={() => setActiveModal("forwarder")}
							sx={{
								bgcolor: "white",
								color: "primary.main",
								minWidth: 200,
								"&:hover": {
									bgcolor: "grey.100",
								},
							}}
						>
							Partner with Logistics
						</Button>
					</Stack>
				</Card>

				{/* Features Grid */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
						gap: 3,
						mb: 8,
					}}
				>
					{[
						{
							icon: <AnalyticsIcon />,
							title: "Real-time Analytics",
							desc: "Track sales, inventory, and customer behavior",
							color: "primary",
						},
						{
							icon: <SecurityIcon />,
							title: "Secure Payments",
							desc: "Mobile money and bank transfer support",
							color: "secondary",
						},
						{
							icon: <LocationOnIcon />,
							title: "Location Tracking",
							desc: "GPS tracking for all deliveries",
							color: "error",
						},
						{
							icon: <SupportIcon />,
							title: "24/7 Support",
							desc: "Dedicated support for all partners",
							color: "info",
						},
					].map((feature, index) => (
						<Card
							key={index}
							sx={{
								p: 3,
								textAlign: "center",
								height: "100%",
								transition: "transform 0.2s, box-shadow 0.2s",
								"&:hover": {
									transform: "translateY(-4px)",
									boxShadow: (theme) => theme.shadows[8],
								},
							}}
						>
							<Avatar
								sx={{
									width: 56,
									height: 56,
									bgcolor: `${feature.color}.light`,
									color: `${feature.color}.main`,
									mx: "auto",
									mb: 2,
								}}
							>
								{feature.icon}
							</Avatar>
							<Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
								{feature.title}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{feature.desc}
							</Typography>
						</Card>
					))}
				</Box>

				{/* Contact Section */}
				<Card sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
					<Typography variant="h4" component="h2" gutterBottom>
						Get in Touch
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
						Have questions about joining Sellub? We&apos;re here to help you get started.
					</Typography>
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={2}
						justifyContent="center"
						alignItems="center"
					>
						<Button
							variant="text"
							startIcon={<EmailIcon />}
							href="mailto:contact@sellub.com"
							sx={{ fontWeight: 500 }}
						>
							contact@sellub.com
						</Button>
						<Button
							variant="contained"
							size="large"
							onClick={() => (window.location.href = "/")}
							sx={{ minWidth: 180 }}
						>
							Explore Marketplace
						</Button>
					</Stack>
				</Card>
			</Container>

			{/* Modal */}
			<Dialog
				open={activeModal !== null}
				onClose={closeModal}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: { borderRadius: 2 },
				}}
			>
				<DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Typography variant="h5" component="h2" fontWeight={600}>
						{getModalTitle(activeModal)}
					</Typography>
					<IconButton onClick={closeModal}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent>
					{submitSuccess ? (
						<Box textAlign="center" sx={{ py: 4 }}>
							<CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
							<Typography variant="h5" gutterBottom fontWeight={600}>
								Application Submitted Successfully!
							</Typography>
							<Typography variant="body1" color="text.secondary">
								We&apos;ll review your application and get back to you within 24 hours.
							</Typography>
						</Box>
					) : (
						<Box component="form" onSubmit={(e) => handleSubmit(e, getModalType(activeModal))}>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
									gap: 3,
								}}
							>
								<TextField
									fullWidth
									label="Full Name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
								<TextField
									fullWidth
									label="Email Address"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
								<TextField
									fullWidth
									label="Phone Number"
									name="phone"
									type="tel"
									value={formData.phone}
									onChange={handleInputChange}
									required
								/>
								<TextField
									fullWidth
									label="Business Name"
									name="businessName"
									value={formData.businessName}
									onChange={handleInputChange}
									required
								/>
								<FormControl fullWidth required>
									<InputLabel>Business Type</InputLabel>
									<Select
										value={formData.businessType}
										label="Business Type"
										onChange={handleSelectChange("businessType")}
									>
										<MenuItem value="retail">Retail Store</MenuItem>
										<MenuItem value="wholesale">Wholesale</MenuItem>
										<MenuItem value="manufacturing">Manufacturing</MenuItem>
										<MenuItem value="services">Services</MenuItem>
										<MenuItem value="food">Food & Beverage</MenuItem>
										<MenuItem value="fashion">Fashion & Apparel</MenuItem>
										<MenuItem value="electronics">Electronics</MenuItem>
										<MenuItem value="other">Other</MenuItem>
									</Select>
								</FormControl>
								<TextField
									fullWidth
									label="Location (City/Region)"
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									placeholder="e.g., Accra, Kumasi, Tamale"
									required
								/>
								<Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
									<TextField
										fullWidth
										label="Tell us about your business"
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										multiline
										rows={3}
										placeholder="Brief description of your business and what you'd like to achieve on Sellub..."
									/>
								</Box>
							</Box>
						</Box>
					)}
				</DialogContent>

				{!submitSuccess && (
					<DialogActions sx={{ p: 3, pt: 0 }}>
						<Button onClick={closeModal} variant="outlined" size="large">
							Cancel
						</Button>
						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={isSubmitting}
							onClick={(e) => handleSubmit(e, getModalType(activeModal))}
							startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
						>
							{isSubmitting ? "Submitting..." : "Submit Application"}
						</Button>
					</DialogActions>
				)}
			</Dialog>
		</Box>
	);
}
