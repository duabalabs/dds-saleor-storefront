import { type ReactNode } from "react";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default async function RootLayout(props: {
	children: ReactNode;
	params: Promise<{ channel: string }>;
}) {
	return (
		<>
			<main className="flex-1">{props.children}</main>
		</>
	);
}
