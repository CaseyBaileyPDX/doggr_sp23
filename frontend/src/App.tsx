import { Button, Header, Home, UsersList, Match, Messages } from "@/Components.tsx";
import { useState } from "react";
import { Link, Route, Routes, Router, BrowserRouter } from "react-router-dom";
import reactLogo from "@images/react.svg";
import viteLogo from "/vite.svg";
import "@css/App.css";

// This is our first React "Component"
export function App() {
	return (
		<BrowserRouter>
		<div className="App">
			<nav>
				<div className="menu">
					<Link to="/">Home</Link> ||
					<Link to="/match">Match</Link>
				</div>
			</nav>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/match" element={<Match />} />
			</Routes>

		</div>
		</BrowserRouter>
	);
}

export default App;


