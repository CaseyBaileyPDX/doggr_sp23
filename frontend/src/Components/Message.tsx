import { Profile } from "@/Components/Profile.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { MessageService } from "@/Services/MessageService.tsx";
import { profileState } from "@/Services/RecoilState.tsx";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

export const MessagePage = () => {
	const [message, setMessage] = useState<string>("");
	const [submissionError, setSubmissionError] = useState(false);
	const auth = useAuth();
	const currentProfile = useRecoilValue(profileState);
	const navigate = useNavigate();

	const onSubmit = async (ev) => {
		const sender_id = auth.userId;
		const receiver_id = currentProfile.id;
		try {
			await MessageService.sendMessage(sender_id, receiver_id, message);
			// If we succeed, send the user onward to message history
			navigate("/messagehistory");
		} catch (err) {
			setSubmissionError(true);
		}
	};

	return (
		<>
			<Profile />
			{ submissionError == true &&

				<div className="flex items-center justify-center text-sm text-red-800  w-4/5 mx-auto bg-red-50 dark:bg-slate-800 dark:text-red-400" role="alert">
					<span className="font-medium">Danger alert! You tried to send one or more bad words!</span>
				</div>
			}
			<div className="flex items-center justify-center rounded-b-box bg-slate-700 w-4/5 mx-auto space-x-8 pt-3 pb-2">

				<label htmlFor="message" className="text-blue-300 mb-2">Message:</label>
				<input
					placeholder="Hi..."
					type="text"
					id="message"
					required
					value={ message }
					onChange={e => setMessage(e.target.value)}
					name="petType"
					className="input input-bordered"
				/>

				{
					message != null &&
					<div>
						<button className="btn btn-primary btn-circle" onClick={onSubmit}>Create</button>
					</div>
				}
			</div>
		</>
	);
};
