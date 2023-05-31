// @ts-nocheck

import React from "react";
// import react-testing methods
import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from 'vitest'; // This is used as IDE hint for the assertion methods
// add custom jest matchers from jest-dom
import "@testing-library/jest-dom";
import { App } from "../src/App.js";
import { Login } from "../src/Components/Login.js";

test("Math.sqrt()", () => {
	expect(Math.sqrt(4)).toBe(2);
	expect(Math.sqrt(144)).toBe(12);
	expect(Math.sqrt(2)).toBe(Math.SQRT2);
});

describe("Renders React components correctly", async () => {
	it("Should render the page correctly", async () => {
		render(<App />);
		// Setup
		const h1 = await screen.queryByText("Doggr");

		// Expectations
		expect(h1).not.toBeNull();
		expect(h1).toBeVisible();
	});
});

test("loads and displays proper login", async () => {
	render(<Login />);

	expect(screen.getByLabelText("Password:")).toBeVisible();
});

