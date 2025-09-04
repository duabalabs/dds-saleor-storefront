"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function HeaderWrapper() {
	const pathname = usePathname();

	// Extract channel from pathname
	// Format: /[channel]/... or just /
	const pathSegments = pathname.split("/").filter(Boolean);

	// If we're on the root path, use default channel
	// If we're on a channel path, use that channel
	let channel = "default-channel";

	// Check if first segment looks like a channel (not a static route)
	if (pathSegments.length > 0) {
		const firstSegment = pathSegments[0];

		// Exclude known static routes from being treated as channels
		const staticRoutes = [
			"products",
			"categories",
			"collections",
			"pages",
			"checkout",
			"cart",
			"login",
			"register",
			"search",
			"api",
			"admin",
			"_next",
		];

		if (!staticRoutes.includes(firstSegment)) {
			channel = firstSegment;
		}
	}

	return <Header channel={channel} />;
}
