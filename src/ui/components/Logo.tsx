import Image from "next/image";
import Link from "next/link";
import { env } from "@/app/config";

export function Logo({ channel }: { channel: string }) {
	const isMarketplaceMode = env.STORE_MODE === "marketplace";

	// In marketplace mode, logo goes to homepage
	// In single store mode, logo goes to channel homepage
	const href = isMarketplaceMode ? "/" : `/${channel}`;

	const logoContent = (
		<div className="flex items-center space-x-2">
			<Image
				src="/logo.png"
				alt="Sellub Logo"
				width={40}
				height={40}
				priority
				className="transition-opacity hover:opacity-80"
			/>
			<span className="text-xl font-bold text-gray-900">
				{isMarketplaceMode ? "Sellub" : channel.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
			</span>
		</div>
	);

	return (
		<Link href={href} className="flex items-center">
			{logoContent}
		</Link>
	);
}
