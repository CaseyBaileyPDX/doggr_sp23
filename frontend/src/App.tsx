import { Button, Header } from "@/Components.tsx";
import { useState } from "react";
import reactLogo from "@images/react.svg";
import viteLogo from "/vite.svg";
import "@css/App.css";

// This is our first React "Component"
export function App() {
	return (
		<div className="App">
			<Header />
			<Button />
		</div>
	);
}

export default App;
