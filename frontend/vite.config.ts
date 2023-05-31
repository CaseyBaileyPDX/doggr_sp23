import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Generates ascii 65-90 (Capital letters) into array Vite is expecting
const alphabet = Array.from(Array(26), (v, k) => {
	return String.fromCharCode(k + 65);
});

export default defineConfig(({ command, mode }) => {
	return {
		plugins: [react(), tsconfigPaths()],
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "./test/setup.ts",
		},
		// vite config
		// https://github.com/vitejs/vite/pull/9880 I am so angry about this
		envPrefix: alphabet,
		server: {
			watch: {
				usePolling: true,
			},
			host: true, // needed for the Docker Container port mapping to work
			strictPort: true,
			port: 5173,
		},
		build: {
			target: "esnext",
			emptyOutDir: true,
			outDir: "build"
		}
	};
});
