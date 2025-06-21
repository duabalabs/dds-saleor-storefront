import { useEffect, useMemo } from "react";

import { type Checkout, useCheckoutQuery } from "@/checkout/graphql";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";

// Get checkout ID directly from storage without URL extraction
const getStoredCheckoutId = (): string | null => {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		// Try direct checkout ID storage first
		const storedCheckoutId = sessionStorage.getItem("saleor-checkout-id");
		if (storedCheckoutId) {
			return storedCheckoutId;
		}

		// Try to extract from stored checkout data
		const storedCheckoutData = sessionStorage.getItem("saleor-checkout");
		if (storedCheckoutData) {
			const checkoutData = JSON.parse(storedCheckoutData) as { id?: string };
			if (checkoutData?.id) {
				return checkoutData.id;
			}
		}
	} catch (error) {
		console.warn("Failed to retrieve checkout ID from storage:", error);
	}

	return null;
};

export const useCheckout = ({ pause = false } = {}) => {
	const id = useMemo(() => getStoredCheckoutId(), []);
	const { setLoadingCheckout } = useCheckoutUpdateStateActions();
	const [{ data, fetching, stale }, refetch] = useCheckoutQuery({
		variables: { id: id ?? "", languageCode: "EN_US" },
		pause: pause || !id, // Pause query if no ID available
	});

	useEffect(() => setLoadingCheckout(fetching || stale), [fetching, setLoadingCheckout, stale]);

	return useMemo(
		() => ({ checkout: data?.checkout as Checkout, fetching: fetching || stale, refetch }),
		[data?.checkout, fetching, refetch, stale],
	);
};
