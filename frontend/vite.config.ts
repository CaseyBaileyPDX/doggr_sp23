import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadEnv } from "vite";
// @ts-ignore
// We're being cheeky to avoid Vite problem with env files
import * as envVars from "./.env.ts";

const define: Record<string, string | undefined> = {};
for (const [key, value] of Object.entries(envVars)) {
	define[`process.env.${key}`] = JSON.stringify(value);
}

export default defineConfig(({ command, mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [react(), tsconfigPaths()],
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "./test/setup.ts",
		},
		// vite config
		define,
	};
});
