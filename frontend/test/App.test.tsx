// @ts-nocheck
// import dependencies
import React from "react";
// import react-testing methods
import { render, fireEvent, screen } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { CreateProfile } from "../src/Components/CreateProfile.js";

import { Home } from "../src/Components/HomePage.js";

 describe("Renders react properly", () => {
	 test("Math.sqrt()", () => {
		 expect(Math.sqrt(4))
			 .toBe(2);
		 expect(Math.sqrt(144))
			 .toBe(12);
		 expect(Math.sqrt(2))
			 .toBe(Math.SQRT2);
	 });

	it("Should render homepage correctly", () => {

			render(<Home />);

			const elem = screen.queryByText("Doggr");
			expect(elem)
				.not
				.toBeNull();
			expect(elem)
				.toBeVisible();

	});

	test("Loads Create Profile", () => {
			render(<MemoryRouter><CreateProfile /></MemoryRouter>);
			expect(screen.getByLabelText("Password:"))
				.toBeVisible();
	});
});
