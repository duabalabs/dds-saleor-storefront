import { useEffect, useMemo, useRef, useState } from "react";
import { type CountryCode, usePaymentGatewaysInitializeMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { type ParsedPaymentGateways } from "@/checkout/sections/PaymentSection/types";
import { getFilteredPaymentGateways } from "@/checkout/sections/PaymentSection/utils";

export const usePaymentGatewaysInitialize = () => {
	const {
		checkout: { billingAddress },
	} = useCheckout();
	const {
		checkout: { id: checkoutId, availablePaymentGateways },
	} = useCheckout();

	// Debug logging for payment gateways
	console.log("🔍 usePaymentGatewaysInitialize - Raw availablePaymentGateways:", availablePaymentGateways);
	console.log(
		"🔍 usePaymentGatewaysInitialize - availablePaymentGateways length:",
		availablePaymentGateways.length,
	);

	const billingCountry = billingAddress?.country.code as MightNotExist<CountryCode>;
	const [gatewayConfigs, setGatewayConfigs] = useState<ParsedPaymentGateways>([]);
	const previousBillingCountry = useRef(billingCountry);

	const [{ fetching }, paymentGatewaysInitialize] = usePaymentGatewaysInitializeMutation();

	// Debug filtered gateways
	const filteredGateways = getFilteredPaymentGateways(availablePaymentGateways);
	console.log("🔍 usePaymentGatewaysInitialize - Filtered gateways:", filteredGateways);
	console.log("🔍 usePaymentGatewaysInitialize - Filtered gateways length:", filteredGateways.length);
	const onSubmit = useSubmit<{}, typeof paymentGatewaysInitialize>(
		useMemo(
			() => ({
				hideAlerts: true,
				scope: "paymentGatewaysInitialize",
				shouldAbort: () => {
					const shouldAbort = !availablePaymentGateways.length;
					console.log(
						"🔍 usePaymentGatewaysInitialize - shouldAbort:",
						shouldAbort,
						"availablePaymentGateways.length:",
						availablePaymentGateways.length,
					);
					return shouldAbort;
				},
				onSubmit: paymentGatewaysInitialize,
				parse: () => {
					const payload = {
						checkoutId,
						paymentGateways: getFilteredPaymentGateways(availablePaymentGateways).map(({ config, id }) => ({
							id,
							data: config,
						})),
					};
					console.log("🔍 usePaymentGatewaysInitialize - Mutation payload:", payload);
					return payload;
				},
				onSuccess: ({ data }) => {
					console.log("🔍 usePaymentGatewaysInitialize - Mutation success:", data);
					const parsedConfigs = (data.gatewayConfigs || []) as ParsedPaymentGateways;

					if (!parsedConfigs.length) {
						console.error("🔍 usePaymentGatewaysInitialize - No gateway configs returned");
						throw new Error("No available payment gateways");
					}

					console.log("🔍 usePaymentGatewaysInitialize - Setting gateway configs:", parsedConfigs);
					setGatewayConfigs(parsedConfigs);
				},
				onError: ({ errors }) => {
					console.error("🔍 usePaymentGatewaysInitialize - Mutation error:", errors);
				},
			}),
			[availablePaymentGateways, checkoutId, paymentGatewaysInitialize],
		),
	);

	useEffect(() => {
		void onSubmit();
	}, []);

	useEffect(() => {
		if (billingCountry !== previousBillingCountry.current) {
			previousBillingCountry.current = billingCountry;
			void onSubmit();
		}
	}, [billingCountry, onSubmit]);

	return {
		fetching,
		availablePaymentGateways: gatewayConfigs || [],
	};
};
