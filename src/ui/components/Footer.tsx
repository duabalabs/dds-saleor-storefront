import Link from "next/link";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function Footer() {
	const channels = process.env.SALEOR_APP_TOKEN
		? await executeGraphQL(ChannelsListDocument, {
				withAuth: false, // disable cookie-based auth for this call
				headers: {
					// and use app token instead
					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
				},
			})
		: null;
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-white">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 gap-8 py-16 md:grid-cols-2 lg:grid-cols-4">
					{/* Company Info */}
					<div className="space-y-4">
						<div className="flex items-center">
							<Image src="/logo.png" alt="Sellub" width={40} height={40} className="mr-3" />
							<h3 className="text-xl font-bold">Sellub</h3>
						</div>
						<p className="text-sm leading-relaxed text-gray-300">
							Ghana's premier marketplace connecting local sellers with customers across the country.
							Supporting Ghanaian businesses and communities.
						</p>
						<div className="flex space-x-4">
							<a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="Facebook">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</a>
							<a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="Twitter">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
								</svg>
							</a>
							<a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="Instagram">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.243 14.814 3.752 13.663 3.752 12.366c0-1.297.49-2.448 1.369-3.328.88-.88 2.031-1.37 3.328-1.37 1.297 0 2.448.49 3.328 1.37.88.88 1.369 2.031 1.369 3.328 0 1.297-.49 2.448-1.369 3.325-.88.807-2.031 1.297-3.328 1.297zm7.718-7.718c-.294 0-.49-.196-.49-.49 0-.294.196-.49.49-.49.294 0 .49.196.49.49 0 .294-.196.49-.49.49zm-3.701 3.701c0 1.297-.49 2.448-1.369 3.328-.88.88-2.031 1.369-3.328 1.369-1.297 0-2.448-.49-3.328-1.369-.88-.88-1.369-2.031-1.369-3.328 0-1.297.49-2.448 1.369-3.328.88-.88 2.031-1.369 3.328-1.369 1.297 0 2.448.49 3.328 1.369.88.88 1.369 2.031 1.369 3.328z" />
								</svg>
							</a>
							<a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="WhatsApp">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488" />
								</svg>
							</a>
						</div>
					</div>

					{/* Customer Service */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Customer Service</h3>
						<ul className="space-y-3 text-sm text-gray-300">
							<li>
								<LinkWithChannel href="/help" className="transition-colors hover:text-white">
									Help Center
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/contact" className="transition-colors hover:text-white">
									Contact Us
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/returns" className="transition-colors hover:text-white">
									Returns & Refunds
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/shipping" className="transition-colors hover:text-white">
									Shipping Info
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/faq" className="transition-colors hover:text-white">
									FAQ
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/track-order" className="transition-colors hover:text-white">
									Track Your Order
								</LinkWithChannel>
							</li>
						</ul>
					</div>

					{/* For Sellers */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">For Sellers</h3>
						<ul className="space-y-3 text-sm text-gray-300">
							<li>
								<LinkWithChannel href="/seller-center" className="transition-colors hover:text-white">
									Seller Center
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/start-selling" className="transition-colors hover:text-white">
									Start Selling
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/seller-guide" className="transition-colors hover:text-white">
									Seller Guide
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/seller-support" className="transition-colors hover:text-white">
									Seller Support
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/fees" className="transition-colors hover:text-white">
									Fees & Pricing
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/seller-app" className="transition-colors hover:text-white">
									Seller App
								</LinkWithChannel>
							</li>
						</ul>
					</div>

					{/* Contact & Payment */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Get in Touch</h3>
						<div className="space-y-3 text-sm text-gray-300">
							<div className="flex items-center space-x-2">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
									<path d="m18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
								</svg>
								<span>support@sellub.com</span>
							</div>
							<div className="flex items-center space-x-2">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
								</svg>
								<span>+233 24 123 4567</span>
							</div>
							<div className="flex items-center space-x-2">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
								</svg>
								<span>Accra, Ghana</span>
							</div>
						</div>

						<div className="mt-6">
							<h4 className="mb-3 text-sm font-semibold">We Accept</h4>
							<div className="flex flex-wrap gap-2">
								<span className="rounded bg-gray-800 px-2 py-1 text-xs">MTN MoMo</span>
								<span className="rounded bg-gray-800 px-2 py-1 text-xs">Vodafone Cash</span>
								<span className="rounded bg-gray-800 px-2 py-1 text-xs">AirtelTigo</span>
								<span className="rounded bg-gray-800 px-2 py-1 text-xs">Visa</span>
								<span className="rounded bg-gray-800 px-2 py-1 text-xs">Mastercard</span>
							</div>
						</div>
					</div>
				</div>

				{/* Channel Selector */}
				{channels?.channels && (
					<div className="border-t border-gray-800 py-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<div className="mb-4 sm:mb-0">
								<label className="flex items-center space-x-2 text-sm text-gray-300">
									<span>🌍 Change region/currency:</span>
									<ChannelSelect channels={channels.channels} />
								</label>
							</div>
							<div className="flex items-center space-x-1 text-sm text-gray-300">
								<span className="inline-block h-4 w-6 bg-red-500"></span>
								<span className="inline-block h-4 w-6 bg-yellow-400"></span>
								<span className="inline-block h-4 w-6 bg-green-500"></span>
								<span className="ml-2">Proudly Ghanaian</span>
							</div>
						</div>
					</div>
				)}

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 py-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<p className="text-sm text-gray-400">
							Copyright &copy; {currentYear} Sellub. All rights reserved.
						</p>
						<div className="mt-4 flex space-x-6 sm:mt-0">
							<LinkWithChannel
								href="/privacy"
								className="text-sm text-gray-400 transition-colors hover:text-white"
							>
								Privacy Policy
							</LinkWithChannel>
							<LinkWithChannel
								href="/terms"
								className="text-sm text-gray-400 transition-colors hover:text-white"
							>
								Terms of Service
							</LinkWithChannel>
							<LinkWithChannel
								href="/cookies"
								className="text-sm text-gray-400 transition-colors hover:text-white"
							>
								Cookie Policy
							</LinkWithChannel>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
