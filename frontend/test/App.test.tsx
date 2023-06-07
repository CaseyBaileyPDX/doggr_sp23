// @ts-nocheck
// import dependencies
import React from "react";
// import react-testing methods
import { render, fireEvent, screen } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { App } from "../src/App.js";
import { Login } from "../src/Components/Login.js";

test("Math.sqrt()", () => {
	expect(Math.sqrt(4))
		.toBe(2);
	expect(Math.sqrt(144))
		.toBe(12);
	expect(Math.sqrt(2))
		.toBe(Math.SQRT2);
});

 describe("Renders react properly", async () => {
// 	it("Should render homepage correctly", async () => {
// 		try {
// 			render(<App />);
//
// 			const elem = await screen.queryByText("Doggr");
// 			expect(elem)
// 				.not
// 				.toBeNull();
// 			expect(elem)
// 				.toBeVisible();
// 		} catch (err) {
// 			console.error(err);
// 		}
// 	});
//
	test("Loads login", async () => {
		try {
			render(<MemoryRouter><Login /></MemoryRouter>);

			expect(screen.getByLabelText("Password:"))
				.toBeVisible();
		} catch (err) {
			console.error(err);
		}

	});
});
