"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "./theme";

interface MuiProviderProps {
	children: React.ReactNode;
}

export function MuiProvider({ children }: MuiProviderProps) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
