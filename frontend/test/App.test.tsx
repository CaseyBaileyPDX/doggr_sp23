// @ts-nocheck
// import dependencies
import React from "react";
// import react-testing methods
import { render, fireEvent, screen } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom";
import { App } from "../src/App.js";

test("Math.sqrt()", () => {
	expect(Math.sqrt(4)).toBe(2);
	expect(Math.sqrt(144)).toBe(12);
	expect(Math.sqrt(2)).toBe(Math.SQRT2);
});

test("loads and displays greeting", async () => {
	// Arrange -- This fake-renders our component to a mock browser
	const testRender = render(<App />);
	// Act - This simulates a person clicking in the browser
	fireEvent.click(screen.getByText("count is 0"));
	// Assert - This tests to make sure the event we just fired did what we expect (increment count)
	expect(screen.getByText("count is 1")).toBeVisible();
});

describe("Renders React components correctly", async () => {
	it("Should render the page correctly", async () => {
		const testRender = render(<App />);
		// Setup
		const h1 = await screen.queryByText("Vite + React");

		// Expectations
		expect(h1).not.toBeNull();
		expect(h1).toBeVisible();
	});
});
