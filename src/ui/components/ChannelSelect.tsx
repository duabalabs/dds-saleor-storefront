"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Channel {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

interface ChannelSelectProps {
	channels: Channel[];
	currentChannel: string;
}

export function ChannelSelect({ channels, currentChannel }: ChannelSelectProps) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const handleChannelSelect = (channelSlug: string) => {
		router.push(`/${channelSlug}`);
		setIsOpen(false);
	};

	const currentChannelData = channels.find((ch) => ch.slug === currentChannel);

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center space-x-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
			>
				<span>🏪</span>
				<span>{currentChannelData?.name || currentChannel}</span>
				<svg
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
					<div className="py-1">
						<button
							onClick={() => {
								router.push("/");
								setIsOpen(false);
							}}
							className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
						>
							🏠 All Shops
						</button>
						{channels
							.filter((ch) => ch.isActive)
							.map((channel) => (
								<button
									key={channel.id}
									onClick={() => handleChannelSelect(channel.slug)}
									className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
										channel.slug === currentChannel ? "bg-green-50 text-green-700" : "text-gray-700"
									}`}
								>
									🏪 {channel.name}
								</button>
							))}
					</div>
				</div>
			)}
		</div>
	);
}
