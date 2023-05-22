import { Home } from "@/Components/HomePage.tsx";
import { Login } from "@/Components/Login.tsx";
import { Logout } from "@/Components/Logout.tsx";
import { Match } from "@/Components/Match.tsx";
import { ProtectedRoute } from "@/Components/ProtectedRoute.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { Link, Route, Routes } from "react-router-dom";

export function DoggrRouter() {
	const auth = useAuth();

	return (
		<>
			<nav>
				<div className="menu">
					<Link to="/">Home</Link> ||
					<Link to="/match"> Match</Link> ||
					{
						auth?.token != null
							? <Link to="/logout">Logout</Link>
							: <Link to="/login"> Login</Link>
					}

				</div>
			</nav>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/match" element={<ProtectedRoute><Match /></ProtectedRoute>} />
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />
			</Routes>
		</>
	);
}

