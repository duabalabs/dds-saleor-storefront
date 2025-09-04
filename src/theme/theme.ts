import { createTheme, type ThemeOptions } from "@mui/material/styles";

// Ghana flag colors
const ghanaColors = {
	primary: {
		main: "#28a745", // Green from Ghana flag
		light: "#5cbf60",
		dark: "#1e7e34",
		contrastText: "#ffffff",
	},
	secondary: {
		main: "#ffc107", // Yellow from Ghana flag
		light: "#fff350",
		dark: "#ff8f00",
		contrastText: "#000000",
	},
	error: {
		main: "#dc3545", // Red from Ghana flag
		light: "#e57373",
		dark: "#c62828",
		contrastText: "#ffffff",
	},
	success: {
		main: "#28a745",
		light: "#5cbf60",
		dark: "#1e7e34",
		contrastText: "#ffffff",
	},
};

const themeOptions: ThemeOptions = {
	palette: {
		mode: "light",
		...ghanaColors,
		background: {
			default: "#fafafa",
			paper: "#ffffff",
		},
		text: {
			primary: "#212529",
			secondary: "#6c757d",
		},
		grey: {
			50: "#fafafa",
			100: "#f5f5f5",
			200: "#eeeeee",
			300: "#e0e0e0",
			400: "#bdbdbd",
			500: "#9e9e9e",
			600: "#757575",
			700: "#616161",
			800: "#424242",
			900: "#212121",
		},
	},
	typography: {
		fontFamily: [
			'"Inter"',
			'"Roboto"',
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Arial",
			"sans-serif",
		].join(","),
		h1: {
			fontSize: "2.5rem",
			fontWeight: 700,
			lineHeight: 1.2,
		},
		h2: {
			fontSize: "2rem",
			fontWeight: 600,
			lineHeight: 1.3,
		},
		h3: {
			fontSize: "1.75rem",
			fontWeight: 600,
			lineHeight: 1.3,
		},
		h4: {
			fontSize: "1.5rem",
			fontWeight: 600,
			lineHeight: 1.4,
		},
		h5: {
			fontSize: "1.25rem",
			fontWeight: 500,
			lineHeight: 1.4,
		},
		h6: {
			fontSize: "1rem",
			fontWeight: 500,
			lineHeight: 1.5,
		},
		body1: {
			fontSize: "1rem",
			lineHeight: 1.6,
		},
		body2: {
			fontSize: "0.875rem",
			lineHeight: 1.6,
		},
		button: {
			textTransform: "none",
			fontWeight: 500,
		},
	},
	shape: {
		borderRadius: 12,
	},
	shadows: [
		"none",
		"0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
		"0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
		"0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
		"0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
		"0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
		"0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
		"0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
		"0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
		"0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
		"0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
		"0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
		"0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
		"0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
		"0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
		"0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
		"0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
		"0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
		"0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
		"0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
		"0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
		"0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
		"0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
		"0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
		"0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
	],
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 8,
					fontWeight: 500,
					padding: "8px 16px",
				},
				contained: {
					boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
					"&:hover": {
						boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
					border: "1px solid rgba(0,0,0,0.05)",
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						borderRadius: 8,
					},
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#ffffff",
					color: "#212529",
					boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
				},
			},
		},
	},
};

export const theme = createTheme(themeOptions);
