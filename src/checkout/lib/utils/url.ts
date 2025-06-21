import queryString from "query-string";
import { type CountryCode } from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/globalTypes";

export type ParamBasicValue = MightNotExist<string>;

const queryParamsMap = {
	redirectUrl: "redirectUrl",
	checkout: "checkoutId",
	order: "orderId",
	token: "passwordResetToken",
	email: "passwordResetEmail",
	saleorApiUrl: "saleorApiUrl",
	// payment flow
	transaction: "transaction", // allows us to process started transaction
	processingPayment: "processingPayment", // tell the processing screen to show up
	// paystack
	paymentStatus: "paymentStatus",
	trxref: "trxref",
	reference: "reference",
	// adyen
	redirectResult: "redirectResult",
	resultCode: "resultCode",
	type: "type",
	// stripe
	payment_intent: "paymentIntent",
	payment_intent_client_secret: "paymentIntentClientSecret",
} as const;

type UnmappedQueryParam = keyof typeof queryParamsMap;

type QueryParam = (typeof queryParamsMap)[UnmappedQueryParam];

interface CustomTypedQueryParams {
	countryCode: CountryCode;
	channel: string;
	saleorApiUrl: string;
}

type RawQueryParams = Record<UnmappedQueryParam, ParamBasicValue> & CustomTypedQueryParams;

export type QueryParams = Record<QueryParam, ParamBasicValue> & CustomTypedQueryParams;

// this is intentional, we know what we'll get from the query but
// queryString has no way to type this in such a specific way
export const getRawQueryParams = () => queryString.parse(location.search) as unknown as RawQueryParams;

export const getQueryParams = (): QueryParams => {
	const params = getRawQueryParams();

	return Object.entries(params).reduce((result, entry) => {
		const [paramName, paramValue] = entry as [UnmappedQueryParam, ParamBasicValue];
		const mappedParamName = queryParamsMap[paramName];
		const mappedParamValue = paramValue;

		return {
			...result,
			[mappedParamName]: mappedParamValue,
		};
	}, {}) as QueryParams;
};

export const clearQueryParams = (...keys: QueryParam[]) => {
	const query = Object.entries(queryParamsMap).reduce((result, [unmappedParam, mappedParam]) => {
		if (!keys.includes(mappedParam)) {
			return result;
		}

		return { ...result, [unmappedParam]: undefined };
	}, {});

	replaceUrl({ query });
};

export const getUrl = ({
	query,
	replaceWholeQuery = false,
}: {
	query?: Record<string, any>;
	replaceWholeQuery?: boolean;
}) => {
	const baseUrl = replaceWholeQuery
		? window.location.toString().replace(window.location.search, "")
		: window.location.toString();
	const newQuery = replaceWholeQuery ? query : { ...getRawQueryParams(), ...query };
	const newUrl = queryString.stringifyUrl({ url: baseUrl, query: newQuery });
	return { newUrl, newQuery };
};

export const replaceUrl = ({
	query,
	replaceWholeQuery = false,
}: {
	url?: string;
	query?: Record<string, any>;
	replaceWholeQuery?: boolean;
}) => {
	const { newUrl, newQuery } = getUrl({ query, replaceWholeQuery });

	window.history.pushState(
		{
			...window.history.state,
			...newQuery,
			url: newUrl,
			as: newUrl,
		},
		"",
		newUrl,
	);

	return newUrl;
};

// Get checkout ID from storage only
export const getCheckoutId = (): string | null => {
	// Only try to get from sessionStorage
	if (typeof window !== "undefined") {
		try {
			// Try direct checkout ID storage
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
	}

	return null;
};

export const extractCheckoutIdFromUrl = (): string => {
	const { checkoutId, paymentStatus, trxref, reference } = getQueryParams();

	if (isOrderConfirmationPage()) {
		return "";
	}

	// Handle payment success callback - extract checkout ID from reference
	if (paymentStatus === "success" && (trxref || reference)) {
		const paymentReference = trxref || reference;
		if (typeof paymentReference === "string") {
			// Extract checkout ID from reference format: checkout-ENCODED_CHECKOUT_ID-TIMESTAMP
			const match = paymentReference.match(/^checkout-([^-]+)-\d+$/);
			if (match?.[1]) {
				try {
					// Try to decode base64 - if it fails, use the value directly
					const decoded = atob(match[1]);
					return decoded;
				} catch (error) {
					return match[1]; // Return the checkout ID directly if not base64
				}
			}
		}
	}

	if (typeof checkoutId !== "string") {
		throw new Error("Checkout token does not exist");
	}

	return checkoutId;
};

export const isOrderConfirmationPage = () => {
	const { orderId } = getQueryParams();
	return typeof orderId === "string";
};
