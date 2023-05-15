import { Home } from "@/Components/HomePage.tsx";
import { Match } from "@/Components/Match.tsx";
import { Link, Route, Routes, Router, BrowserRouter } from "react-router-dom";
import "@css/App.css";

// This is our first React "Component"
export function App() {
	return (
		<BrowserRouter>
		<div className="App">
			<nav>
				<div className="menu" >
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


