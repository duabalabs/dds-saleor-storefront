import Link from "next/link";
import { type MenuItemFragment } from "@/gql/graphql";

interface NavMenuProps {
	items: MenuItemFragment[];
}

export function NavMenu({ items }: NavMenuProps) {
	return (
		<nav className="py-4">
			<ul className="flex items-center space-x-8 overflow-x-auto">
				{items.map((item) => (
					<li key={item.id} className="whitespace-nowrap">
						{item.url ? (
							<Link
								href={item.url}
								className="font-medium text-gray-700 transition-colors hover:text-gray-900"
							>
								{item.name}
							</Link>
						) : item.category ? (
							<Link
								href={`/categories/${item.category.slug}`}
								className="font-medium text-gray-700 transition-colors hover:text-gray-900"
							>
								{item.name}
							</Link>
						) : item.collection ? (
							<Link
								href={`/collections/${item.collection.slug}`}
								className="font-medium text-gray-700 transition-colors hover:text-gray-900"
							>
								{item.name}
							</Link>
						) : item.page ? (
							<Link
								href={`/pages/${item.page.slug}`}
								className="font-medium text-gray-700 transition-colors hover:text-gray-900"
							>
								{item.name}
							</Link>
						) : (
							<span className="font-medium text-gray-700">{item.name}</span>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}
