import { compact } from "lodash-es";
import { adyenGatewayId } from "./AdyenDropIn/types";
import { stripeGatewayId } from "./StripeElements/types";
import { paystackGatewayId } from "./Paystack/types";
import {
	type CheckoutAuthorizeStatusEnum,
	type CheckoutChargeStatusEnum,
	type OrderAuthorizeStatusEnum,
	type OrderChargeStatusEnum,
	type PaymentGateway,
} from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { getUrl } from "@/checkout/lib/utils/url";
import { type PaymentStatus } from "@/checkout/sections/PaymentSection/types";

export const supportedPaymentGateways = [adyenGatewayId, stripeGatewayId, paystackGatewayId] as const;

export const getFilteredPaymentGateways = (
	paymentGateways: MightNotExist<PaymentGateway[]>,
): PaymentGateway[] => {
	if (!paymentGateways) {
		console.log("⚠️ No payment gateways provided to filter");
		return [];
	}

	console.log(
		"🔍 Available payment gateways from API:",
		paymentGateways.map((gateway) => ({
			id: gateway?.id,
			name: gateway?.name,
		})),
	);

	console.log("✅ Supported payment gateway IDs:", supportedPaymentGateways);
	console.log("🎯 Looking for Paystack gateway ID:", paystackGatewayId);

	// we want to use only payment apps, not plugins
	const filtered = compact(paymentGateways).filter(({ id }) => {
		const isSupported = supportedPaymentGateways.includes(id);
		console.log(`Gateway ID "${id}" supported: ${isSupported}`);
		return isSupported;
	});

	console.log(
		"✨ Final filtered payment gateways:",
		filtered.map((gateway) => ({
			id: gateway.id,
			name: gateway.name,
		})),
	);

	if (filtered.length === 0) {
		console.error("❌ No supported payment gateways found after filtering!");
		console.error(
			"Available IDs:",
			paymentGateways.map((g) => g?.id),
		);
		console.error("Supported IDs:", supportedPaymentGateways);
	}

	return filtered;
};

export const getUrlForTransactionInitialize = () => getUrl({ query: { processingPayment: true } });

export const usePaymentStatus = ({
	chargeStatus,
	authorizeStatus,
}: {
	chargeStatus: CheckoutChargeStatusEnum | OrderChargeStatusEnum;
	authorizeStatus: CheckoutAuthorizeStatusEnum | OrderAuthorizeStatusEnum;
}): PaymentStatus => {
	if (chargeStatus === "NONE" && authorizeStatus === "FULL") {
		return "authorized";
	}

	if (chargeStatus === "FULL") {
		return "paidInFull";
	}

	if (chargeStatus === "OVERCHARGED") {
		return "overpaid";
	}

	return "none";
};
