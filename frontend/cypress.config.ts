import { defineConfig } from "cypress";

export default defineConfig({
	component: {
		specPattern: "**/*.cy.{js,jsx,ts,tsx}",
		devServer: {
			framework: "react",
			bundler: "vite",
		},
	},
});
