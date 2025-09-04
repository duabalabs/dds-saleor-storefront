import Link from "next/link";
import { type ReactNode } from "react";

interface LinkWithChannelProps {
	href: string;
	channel: string;
	children: ReactNode;
	className?: string;
}

export function LinkWithChannel({ href, channel, children, className }: LinkWithChannelProps) {
	// Construct the URL with channel prefix
	const channelHref = `/${channel}${href}`;

	return (
		<Link href={channelHref} className={className}>
			{children}
		</Link>
	);
}
