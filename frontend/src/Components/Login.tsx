import { useAuth } from "@/Services/Auth.tsx";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

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
		<div className="flex flex-col items-center rounded-box justify-center w-1/3 mx-auto bg-neutral pt-5">
			<div className="text-4xl font-bold">Login</div>

			{submitFailed &&
				<div className="text-error-content bg-error p-4 rounded-box mb-6">
					Your password or email was incorrect! Please try again.
				</div>
			}

			<div className="w-full max-w-screen-xl mx-auto space-y-4 p-6 rounded-box">
				<div className="flex items-center space-x-2">
					<label htmlFor={"email"} className="font-medium w-24 text-accent">Email Address:</label>
					<input
						type="email"
						id="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						name={"email"}
						className="input input-bordered flex-grow mt-2"
					/>
				</div>

				<div className="flex items-center space-x-2">
					<label htmlFor={"password"} className="font-medium w-24 text-accent">Password:</label>
					<input
						type="password"
						id="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						name={"password"}
						className="input input-bordered flex-grow mt-2"
					/>
				</div>

				<div>
					<button onClick={onSubmitLogin} className="btn btn-primary w-full">Submit</button>
				</div>
			</div>
		</div>
	);
}
