// Note: PaystackPop window interface is declared in PaystackComponent.tsx
// to avoid type conflicts. This file only contains utility functions.

// Paystack configuration bypass - use environment variables instead of Saleor gateway config
export interface PaystackBypassConfig {
	id: string;
	name: string;
	publicKey: string;
	enabled: boolean;
	currencies: string[];
}

export const getPaystackBypassConfig = (): PaystackBypassConfig | null => {
	const enabled = process.env.NEXT_PUBLIC_PAYSTACK_ENABLED === "true";
	const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
	const gatewayId = process.env.NEXT_PUBLIC_PAYSTACK_GATEWAY_ID;

	if (!enabled || !publicKey || !gatewayId) {
		console.log("🔒 Paystack bypass config not available:", {
			enabled,
			publicKey: !!publicKey,
			gatewayId: !!gatewayId,
		});
		return null;
	}

	return {
		id: gatewayId,
		name: "Paystack (With Transaction Gateway)",
		publicKey,
		enabled,
		currencies: ["USD", "NGN", "GHS", "ZAR", "KES"], // Common Paystack currencies
	};
};

// Function to wait for Paystack script to load
const waitForPaystackScript = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		// If already loaded, resolve immediately
		if (typeof window !== "undefined" && window.PaystackPop) {
			resolve();
			return;
		}

		// Wait for script to load with timeout
		const timeout = setTimeout(() => {
			reject(new Error("Paystack script loading timeout"));
		}, 10000); // 10 second timeout

		const checkScript = () => {
			if (typeof window !== "undefined" && window.PaystackPop) {
				clearTimeout(timeout);
				resolve();
			} else {
				setTimeout(checkScript, 100); // Check every 100ms
			}
		};

		checkScript();
	});
};

// Currency conversion utility for USD to GHS
export const convertCurrency = (
	amount: number,
	fromCurrency: string,
): {
	amount: number;
	currency: string;
	originalAmount: number;
	originalCurrency: string;
	exchangeRate: number;
} => {
	const conversionEnabled = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY_CONVERSION_ENABLED === "true";
	const targetCurrency = process.env.NEXT_PUBLIC_PAYSTACK_TARGET_CURRENCY || "GHS";
	const exchangeRate = parseFloat(process.env.NEXT_PUBLIC_PAYSTACK_USD_TO_GHS_RATE || "14.5");

	if (!conversionEnabled || fromCurrency === targetCurrency) {
		return {
			amount,
			currency: fromCurrency,
			originalAmount: amount,
			originalCurrency: fromCurrency,
			exchangeRate: 1,
		};
	}

	if (fromCurrency === "USD" && targetCurrency === "GHS") {
		const convertedAmount = amount * exchangeRate;
		return {
			amount: convertedAmount,
			currency: targetCurrency,
			originalAmount: amount,
			originalCurrency: fromCurrency,
			exchangeRate,
		};
	}

	// If conversion not supported, return original
	console.warn(`Currency conversion from ${fromCurrency} to ${targetCurrency} not supported`);
	return {
		amount,
		currency: fromCurrency,
		originalAmount: amount,
		originalCurrency: fromCurrency,
		exchangeRate: 1,
	};
};

// Paystack popup configuration - now async to wait for script loading
export const initializePaystackPayment = async (config: {
	publicKey: string;
	email: string;
	amount: number; // In kobo for NGN, cents for USD
	currency: string;
	reference: string;
	onSuccess: (reference: { reference: string; status: string; transaction: string; message: string }) => void;
	onClose: () => void;
}) => {
	try {
		console.log("🔄 Waiting for Paystack script to load...");
		await waitForPaystackScript();
		console.log("✅ Paystack script loaded successfully");

		// This will use Paystack's inline popup
		if (typeof window !== "undefined" && window.PaystackPop) {
			const handler = window.PaystackPop.setup({
				key: config.publicKey,
				email: config.email,
				amount: config.amount,
				currency: config.currency,
				ref: config.reference,
				callback: config.onSuccess,
				onClose: config.onClose,
			});
			handler.openIframe();
		} else {
			throw new Error("Paystack SDK not available after loading");
		}
	} catch (error) {
		console.error("❌ Failed to initialize Paystack payment:", error);
		throw new Error("Paystack SDK not available");
	}
};
