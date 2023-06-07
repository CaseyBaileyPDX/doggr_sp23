/** @type {import("tailwindcss").Config} */
import daisyui from "daisyui";

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {}
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				doggr: {
					"primary": "#3040b9",
					"secondary": "#314157",
					"accent": "#87c5ff",
					"neutral": "#314157",
					"base-100": "#1d232a",
					"info": "#3abff8",
					"success": "#36d399",
					"warning": "#fbbd23",
					"error": "#f87272"
				}
			}
		],
		styled: true,
		darkTheme: "doggr"
	}
};

