"use client";

import { ProductList } from "@/ui/components/ProductList";
import { HeroSection } from "@/ui/components/HeroSection";
import { FeaturedCategories } from "@/ui/components/FeaturedCategories";

// Client wrapper for ProductList
export function ClientProductList(props: any) {
	return <ProductList {...props} />;
}

// Client wrapper for HeroSection
export function ClientHeroSection(props: any) {
	return <HeroSection {...props} />;
}

// Client wrapper for FeaturedCategories
export function ClientFeaturedCategories(props: any) {
	return <FeaturedCategories {...props} />;
}
