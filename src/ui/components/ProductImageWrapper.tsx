import Image from "next/image";

interface ProductImageWrapperProps {
	product: {
		name: string;
		thumbnail?: { url: string; alt?: string | null } | null;
	};
	sizes?: string;
	className?: string;
}

export function ProductImageWrapper({ product, sizes, className }: ProductImageWrapperProps) {
	if (!product.thumbnail?.url) {
		return (
			<div className={`flex items-center justify-center bg-gray-200 ${className}`}>
				<span className="text-4xl text-gray-400">📦</span>
			</div>
		);
	}

	return (
		<Image
			src={product.thumbnail.url}
			alt={product.thumbnail.alt || product.name}
			fill
			sizes={sizes}
			className={className}
		/>
	);
}
