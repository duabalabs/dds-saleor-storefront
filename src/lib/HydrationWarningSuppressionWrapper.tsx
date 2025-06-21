"use client";

import { type ReactNode } from "react";
import { useSuppressHydrationWarnings } from "@/lib/hydration-utils";

interface HydrationWarningSuppressionWrapperProps {
	children: ReactNode;
}

/**
 * Client component wrapper that suppresses hydration warnings caused by browser extensions.
 * This component should wrap the root layout content to prevent console spam from
 * browser extension attributes like bis_register, cz_shortcut_listen, etc.
 */
export const HydrationWarningSuppressionWrapper = ({ children }: HydrationWarningSuppressionWrapperProps) => {
	useSuppressHydrationWarnings();

	return <>{children}</>;
};
