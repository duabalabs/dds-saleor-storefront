"use client";

import { Suspense, useEffect, useState } from "react";
import { useMutation, gql } from "urql";
import { useRouter, useSearchParams } from "next/navigation";

const CHECKOUT_COMPLETE_MUTATION = gql`
	mutation checkoutComplete($checkoutId: ID!) {
		checkoutComplete(id: $checkoutId) {
			order {
				id
				token
			}
			errors {
				field
				message
			}
		}
	}
`;

const TRANSACTION_PROCESS_MUTATION = gql`
	mutation transactionProcess($id: ID!, $data: JSON) {
		transactionProcess(id: $id, data: $data) {
			transaction {
				id
				processedEvents {
					id
				}
			}
			errors {
				field
				message
			}
		}
	}
`;

// Types for checkoutComplete mutation
interface CheckoutCompleteError {
	field: string | null;
	message: string | null;
}

interface CheckoutCompleteOrder {
	id: string;
	token: string;
}

interface CheckoutCompletePayload {
	order: CheckoutCompleteOrder | null;
	errors: CheckoutCompleteError[];
}

interface CheckoutCompleteMutation {
	checkoutComplete: CheckoutCompletePayload | null;
}

interface CheckoutCompleteVariables {
	checkoutId: string;
}

// Types for transactionProcess mutation
interface TransactionProcessError {
	field: string | null;
	message: string | null;
}

interface TransactionProcessTransaction {
	id: string;
	processedEvents: { id: string }[];
}

interface TransactionProcessPayload {
	transaction: TransactionProcessTransaction | null;
	errors: TransactionProcessError[];
}

interface TransactionProcessMutation {
	transactionProcess: TransactionProcessPayload | null;
}

interface TransactionProcessVariables {
	id: string;
	data: Record<string, unknown>;
}

function PaystackCallback() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [processing, setProcessing] = useState(true);

	const [, processTransaction] = useMutation<TransactionProcessMutation, TransactionProcessVariables>(
		TRANSACTION_PROCESS_MUTATION,
	);
	const [, completeCheckout] = useMutation<CheckoutCompleteMutation, CheckoutCompleteVariables>(
		CHECKOUT_COMPLETE_MUTATION,
	);

	useEffect(() => {
		const processPayment = async () => {
			const reference = searchParams.get("reference");
			const trxref = searchParams.get("trxref");
			const saleorTransactionId = sessionStorage.getItem("saleorTransactionId");
			const saleorCheckoutId = sessionStorage.getItem("saleorCheckoutId");

			if (!reference || !trxref || !saleorTransactionId || !saleorCheckoutId) {
				// Redirect to checkout with an error
				router.push(`/checkout?error=missing_data`);
				return;
			}

			try {
				// 1. Process the transaction with Saleor
				const processResult = await processTransaction({
					id: saleorTransactionId,
					data: { reference, trxref },
				});

				if (processResult.error || (processResult.data?.transactionProcess?.errors?.length ?? 0) > 0) {
					console.error("Transaction processing failed:", processResult.data?.transactionProcess?.errors);
					throw new Error("Transaction processing failed");
				}

				// 2. Complete the checkout
				const completeResult = await completeCheckout({ checkoutId: saleorCheckoutId });

				if (completeResult.error || (completeResult.data?.checkoutComplete?.errors?.length ?? 0) > 0) {
					console.error("Checkout completion failed:", completeResult.data?.checkoutComplete?.errors);
					throw new Error("Checkout completion failed");
				}

				const order = completeResult.data?.checkoutComplete?.order;
				if (order?.token) {
					// 3. Redirect to order confirmation page
					router.push(`/order/${order.token}`);
				} else {
					throw new Error("Order creation failed");
				}
			} catch (error) {
				console.error(error);
				// Redirect to checkout with an error
				router.push(`/checkout?error=payment_failed`);
			} finally {
				// 4. Clean up session storage
				sessionStorage.removeItem("saleorTransactionId");
				sessionStorage.removeItem("saleorCheckoutId");
				setProcessing(false);
			}
		};

		void processPayment();
	}, [router, searchParams, processTransaction, completeCheckout]);

	if (processing) {
		return <div>Processing your payment...</div>;
	}

	return <div>Redirecting...</div>;
}

export default function PaystackCallbackPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PaystackCallback />
		</Suspense>
	);
}
