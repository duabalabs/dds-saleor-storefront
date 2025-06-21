/**
 * Suppresses hydration warnings for browser extension attributes that are commonly
 * added by password managers, security extensions, and other browser extensions.
 *
 * These attributes don't affect functionality but cause hydration mismatches
 * because they're added on the client side after React hydration.
 */

import { useEffect } from "react";

/**
 * Common browser extension attributes that cause hydration warnings
 */
const BROWSER_EXTENSION_ATTRIBUTES = [
	"bis_register", // Browser security extensions
	"bis_skin_checked", // Browser security extensions
	"cz_shortcut_listen", // Password managers
	"data-dashlane-rid", // Dashlane password manager
	"data-lastpass-icon", // LastPass password manager
	"data-1password-icon", // 1Password password manager
	"data-bitwarden-icon", // Bitwarden password manager
	"__processed_956389aa-d402-4058-affc-60037bd69530__", // Various extensions
];

/**
 * Suppresses hydration warnings in development by intercepting console.error
 * and filtering out warnings related to browser extension attributes.
 */
export const useSuppressHydrationWarnings = (): void => {
	useEffect(() => {
		if (process.env.NODE_ENV !== "development") {
			return;
		}

		const originalError = console.error;
		console.error = (...args: unknown[]) => {
			const errorMessage = args[0];

			if (
				typeof errorMessage === "string" &&
				errorMessage.includes("hydrated but some attributes") &&
				BROWSER_EXTENSION_ATTRIBUTES.some((attr) =>
					args.some((arg) => typeof arg === "string" && arg.includes(attr)),
				)
			) {
				// Suppress hydration warnings for known browser extension attributes
				return;
			}

			// Allow payment gateway errors to be logged normally
			if (
				typeof errorMessage === "string" &&
				(errorMessage.includes("PaymentMethods") || errorMessage.includes("Gateway"))
			) {
				originalError.apply(console, args);
				return;
			}

			// Call original error for all other errors
			originalError.apply(console, args);
		};

		return () => {
			console.error = originalError;
		};
	}, []);
};
