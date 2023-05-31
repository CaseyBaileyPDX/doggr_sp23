import { useAuth } from "@/Services/Auth.tsx";
import { Link } from "react-router-dom";

export function NavBar() {
	const auth = useAuth();

	return (
		<nav className="bg-blue-800 rounded-b shadow-lg mb-4">
			<div className="navbar justify-center">
				<div className={"navbar-center lg:flex"}>

					<ul className={"menu menu-horizontal"}>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/match"> Match</Link></li>
						{auth?.token != null ? (
							<li><Link to="/logout">Logout</Link></li>
						) : (
							<>
								<li><Link to="/login"> Login</Link></li>
								<li><Link to="/create"> Create Account</Link> </li>
							</>
						)}</ul>

				</div>
			</div>
		</nav>

	);
}
