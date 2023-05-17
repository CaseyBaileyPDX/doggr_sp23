module.exports = {
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: { ecmaVersion: "latest", sourceType: "module" },
	plugins: ["react-refresh", "@typescript-eslint"],
	rules: {
		"react-refresh/only-export-components": "warn",
		semi: "error",
		"default-param-last": "error",
		"newline-per-chained-call": "error",
		"no-return-await": "error",
		"no-console": "off",
		"consistent-return": "warn",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-unused-vars": "off", // Change "off" to "error" for prod config
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
	},
};
