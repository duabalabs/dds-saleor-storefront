import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { getNextServerCookiesStorageAsync } from "@saleor/auth-sdk/next/server";
import { invariant } from "ts-invariant";

export const ProductsPerPage = 12;

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

export const getServerAuthClient = async () => {
	const nextServerCookiesStorage = await getNextServerCookiesStorageAsync();
	return createSaleorAuthClient({
		saleorApiUrl,
		refreshTokenStorage: nextServerCookiesStorage,
		accessTokenStorage: nextServerCookiesStorage,
	});
};

export const env = {
	SALEOR_API_URL: process.env.SALEOR_API_URL || "https://demo.saleor.io/graphql/",
	NEXT_PUBLIC_SALEOR_API_URL: process.env.NEXT_PUBLIC_SALEOR_API_URL || "https://demo.saleor.io/graphql/",
	STORE_MODE: (process.env.NEXT_PUBLIC_STORE_MODE as "marketplace" | "single-store") || "marketplace",
	SINGLE_STORE_CHANNEL: process.env.NEXT_PUBLIC_SINGLE_STORE_CHANNEL || "default-channel",
	MARKETPLACE_NAME: process.env.NEXT_PUBLIC_MARKETPLACE_NAME || "Sellub Marketplace",
	SINGLE_STORE_NAME: process.env.NEXT_PUBLIC_SINGLE_STORE_NAME || "Store",
} as const;

// Store mode helpers
export const isMarketplaceMode = () => env.STORE_MODE === "marketplace";
export const isSingleStoreMode = () => env.STORE_MODE === "single-store";
