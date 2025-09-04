import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata } from "next";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";
import { HeaderWrapper } from "@/ui/components/HeaderWrapper";
import { Footer } from "@/ui/components/Footer";
import { MuiProvider } from "@/theme/MuiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Sellub Marketplace - Shop from Local Sellers",
	description:
		"Discover amazing products from local sellers across Ghana. Support local businesses and find everything you need in one place.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="min-h-dvh">
			<body className={`${inter.className} min-h-dvh`}>
				<MuiProvider>
					<HeaderWrapper />
					<div className="flex min-h-[calc(100dvh-64px)] flex-col">
						<main className="flex-1">{children}</main>
						<Footer />
					</div>
				</MuiProvider>
				<Suspense>
					<DraftModeNotification />
				</Suspense>
			</body>
		</html>
	);
}
