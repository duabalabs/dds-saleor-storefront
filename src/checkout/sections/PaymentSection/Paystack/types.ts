export const paystackGatewayId = "saleor.app.paystack.sammydamz";

export interface PaymentMethodProps {
	config?: any; // Gateway configuration from Saleor (optional)
}

export interface PaystackResponseData {
	reference: string;
	status: string;
	transaction: string;
	message: string;
}

export interface PaystackConfig {
	secretKey: string;
	publicKey: string;
	environment: "test" | "live";
	webhookSecret?: string;
	testMode: boolean;
	supportedCurrencies: string[];
	paymentMethods: string[];
	defaultCurrency: string;
}

export interface PaystackGatewayInitializePayload {
	id: string;
	data: {
		publicKey: string;
		amount: number;
		currency: string;
		email: string;
		reference: string;
		transactionId?: string;
		callback_url?: string;
		metadata?: {
			saleor_transaction_id: string;
			channel_id: string;
			[key: string]: any;
		};
	};
}

export interface PaystackInitializeRequest {
	amount: number;
	currency: string;
	email: string;
	reference: string;
	callback_url?: string;
	metadata?: {
		saleor_transaction_id: string;
		channel_id: string;
		[key: string]: any;
	};
}

export interface PaystackApiResponse {
	status: boolean;
	message: string;
	data?: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
	authorization_url?: string; // Sometimes it's at the root level
	access_code?: string;
	reference?: string;
}
