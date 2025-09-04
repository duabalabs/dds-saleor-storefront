"use client";

import Link from "next/link";
import { AppBar, Toolbar, Box, Container, Button, TextField, InputAdornment, Stack } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CartSummary } from "./CartSummary";
import { LinkWithChannel } from "./LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { env } from "@/app/config";
import { executeGraphQL } from "@/lib/graphql";
import { ChannelsListDocument } from "@/gql/graphql";

export function Header({ channel }: { channel: string }) {
	const isMarketplaceMode = env.STORE_MODE === "marketplace";
	const [channels, setChannels] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchChannels() {
			try {
				const data = await executeGraphQL(ChannelsListDocument, { withAuth: true });
				console.log(data);
				setChannels(data.channels || []);
			} catch (error) {
				console.error("Error fetching channels:", error);
				setChannels([]);
			} finally {
				setLoading(false);
			}
		}
		if (isMarketplaceMode) {
			void fetchChannels();
		}
	}, [isMarketplaceMode]);

	return (
		<AppBar position="static" sx={{ bgcolor: "white", boxShadow: 1 }}>
			<Container maxWidth="lg">
				<Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
					{/* Logo and Navigation */}
					<Stack direction="row" spacing={4} alignItems="center">
						<Logo channel={channel} />

						{/* Main Navigation */}
						<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3 }}>
							{isMarketplaceMode ? (
								<>
									<Button
										component={Link}
										href="/"
										sx={{ color: "text.primary", fontWeight: 500, textTransform: "none" }}
									>
										Home
									</Button>
									<Button
										component={Link}
										href="/products"
										sx={{ color: "text.primary", fontWeight: 500, textTransform: "none" }}
									>
										All Products
									</Button>
									<Button
										component={Link}
										href="/categories"
										sx={{ color: "text.primary", fontWeight: 500, textTransform: "none" }}
									>
										Categories
									</Button>
									<Button
										component={Link}
										href="/sellers"
										sx={{ color: "text.primary", fontWeight: 500, textTransform: "none" }}
									>
										Sellers
									</Button>
								</>
							) : (
								<>
									<LinkWithChannel
										href="/products"
										channel={channel}
										className="font-medium text-gray-700 hover:text-gray-900"
									>
										Products
									</LinkWithChannel>
									<LinkWithChannel
										href="/categories"
										channel={channel}
										className="font-medium text-gray-700 hover:text-gray-900"
									>
										Categories
									</LinkWithChannel>
									<LinkWithChannel
										href="/collections"
										channel={channel}
										className="font-medium text-gray-700 hover:text-gray-900"
									>
										Collections
									</LinkWithChannel>
								</>
							)}
							<Button
								component={Link}
								href="/deals"
								sx={{ color: "text.primary", fontWeight: 500, textTransform: "none" }}
							>
								Deals
							</Button>
							<Button
								component={Link}
								href="/about"
								sx={{ color: "text.primary", fontWeight: 500, textTransform: "none" }}
							>
								About
							</Button>
						</Box>
					</Stack>

					{/* Right Side - Search, Channel Select, Cart */}
					<Stack direction="row" spacing={2} alignItems="center">
						<Box sx={{ display: { xs: "none", md: "block" } }}>
							<TextField
								placeholder="Search products..."
								size="small"
								sx={{ width: 256 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon sx={{ color: "text.secondary" }} />
										</InputAdornment>
									),
								}}
							/>
						</Box>

						{/* Channel Selector for Marketplace Mode */}
						{isMarketplaceMode && !loading && channels.length > 0 && (
							<ChannelSelect channels={channels} currentChannel={channel} />
						)}

						{/* Store Info for Single Store Mode */}
						{!isMarketplaceMode && (
							<Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right" }}>
								<Box sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
									{channel.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
								</Box>
								<Box sx={{ fontSize: 12, color: "text.secondary" }}>Premium Store</Box>
							</Box>
						)}

						<CartSummary />
					</Stack>
				</Toolbar>

				{/* Mobile Navigation */}
				<Box
					sx={{ display: { xs: "block", md: "none" }, borderTop: 1, borderColor: "divider", pt: 2, pb: 1 }}
				>
					<Stack direction="row" spacing={2} sx={{ overflowX: "auto" }}>
						{isMarketplaceMode ? (
							<>
								<Button
									component={Link}
									href="/"
									size="small"
									sx={{ color: "text.primary", textTransform: "none", whiteSpace: "nowrap" }}
								>
									Home
								</Button>
								<Button
									component={Link}
									href="/products"
									size="small"
									sx={{ color: "text.primary", textTransform: "none", whiteSpace: "nowrap" }}
								>
									Products
								</Button>
								<Button
									component={Link}
									href="/categories"
									size="small"
									sx={{ color: "text.primary", textTransform: "none", whiteSpace: "nowrap" }}
								>
									Categories
								</Button>
								<Button
									component={Link}
									href="/sellers"
									size="small"
									sx={{ color: "text.primary", textTransform: "none", whiteSpace: "nowrap" }}
								>
									Sellers
								</Button>
							</>
						) : (
							<>
								<LinkWithChannel
									href="/products"
									channel={channel}
									className="whitespace-nowrap text-sm text-gray-700"
								>
									Products
								</LinkWithChannel>
								<LinkWithChannel
									href="/categories"
									channel={channel}
									className="whitespace-nowrap text-sm text-gray-700"
								>
									Categories
								</LinkWithChannel>
							</>
						)}
					</Stack>
				</Box>
			</Container>
		</AppBar>
	);
}
