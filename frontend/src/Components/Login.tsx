import { useAuth } from "@/Services/Auth.tsx";
import { useCallback, useState } from "react";

export function Login() {
	const context = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitFailed, setSubmitFailed] = useState(false);

	const onSubmitLogin = useCallback(async () => {
		if (context) {
			const loginSuccess = await context.handleLogin(email, password);
			if (!loginSuccess) {
				setSubmitFailed(true);
			}
		} else {
			console.error("We have no auth context WARNING WARNING");
		}
	}, [email, password, context, setSubmitFailed]);

	return (
		<div>
			<div>Login</div>
			<div>
				{submitFailed ? <p>Your password or email was incorrect! Please try again.</p> : null}
			</div>

			<div>
				<label htmlFor={"email"}>Email Address:</label>
				<input
					type="text"
					id="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					name={"email"}
				/>
			</div>

			<div>
				<label htmlFor={"password"}>Password:</label>
				<input
					type="text"
					id="password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					name={"password"}
				/>
			</div>

			<div>
				<button onClick={onSubmitLogin}>Submit</button>
			</div>
		</div>
	);
}
