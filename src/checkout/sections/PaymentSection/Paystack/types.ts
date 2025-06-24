import type { PaymentGateway } from "@/checkout/graphql";

export interface PaymentMethodProps {
	config: PaymentGateway;
}

// Paystack-specific interfaces following Saleor documentation patterns
export interface PaystackPaymentData {
	reference?: string;
	amount?: string;
	currency?: string;
	email?: string;
	publicKey?: string;
}

export interface PaystackResponse {
	reference: string;
	status: string;
	transaction: string;
	message: string;
}

// Transaction initialize response following Saleor API patterns
export interface TransactionInitializeResponse {
	data?: {
		transactionInitialize?: {
			transaction?: {
				id: string;
			};
			transactionEvent?: {
				id: string;
				type: string;
			};
			errors?: Array<{
				field: string | null;
				message: string | null;
				code: string;
			}>;
		};
	};
}

// Paystack gateway configuration
export const PAYSTACK_GATEWAY_ID = "saleor.app.paystack.sammydamz";
