import { httpClient } from "@/Services/HttpClient.tsx";
import { useState } from "react";

export enum SubmissionStatus {
	NotSubmitted,
	SubmitFailed,
	SubmitSucceeded
}

export const CreateProfile = () => {

	const [selectedFile, setSelectedFile] = useState();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [petType, setPetType] = useState("");
	const [submitted, setSubmitted] = useState(SubmissionStatus.NotSubmitted);

	const onFileChange = ev => {
		setSelectedFile(ev.target.files[0]);
	};

	const onUploadFile = (ev) => {
		const formData = new FormData();

		formData.append("name", name);
		formData.append('email', email);
		formData.append("password", password);
		formData.append("petType", petType);
		formData.append('file', selectedFile);

		// @ts-ignore
		formData.append("fileName", selectedFile.name);

		const config = {
			headers: {
				'content-type': 'multipart/form-data',
			}
		};

		httpClient.post("/users", formData, config)
			.then( (response) => {
				console.log("Got response from uploading file", response.status);
				if (response.status === 200) {
					setSubmitted(SubmissionStatus.SubmitSucceeded);
				} else {
					setSubmitted(SubmissionStatus.SubmitFailed);
				}
			});
	};

	return (
		<div className="flex flex-col items-center bg-slate-700 w-4/5 mx-auto p-5 rounded-box">
			<h2 className="text-4xl text-blue-600 mb-5">Create Account:</h2>
			{
				submitted === SubmissionStatus.SubmitFailed &&
				<h3 className="text-red-500">CREATING PROFILE FAILED!</h3>
			}

			<div className="flex flex-col w-full mb-5">
				<label htmlFor="name" className="text-blue-300 mb-2">Name</label>
				<input
					placeholder="Name..."
					type="text"
					id="name"
					required
					value={name}
					onChange={e => setName(e.target.value)}
					name="name"
					className="input input-bordered"
				/>
			</div>

			<div className="flex flex-col w-full mb-5">
				<label htmlFor="petType" className="text-blue-300 mb-2">Pet Type</label>
				<input
					placeholder="Dog..."
					type="text"
					id="petType"
					required
					value={petType}
					onChange={e => setPetType(e.target.value)}
					name="petType"
					className="input input-bordered"
				/>
			</div>

			<div className="flex flex-col w-full mb-5">
				<label htmlFor="email" className="text-blue-300 mb-2">Email:</label>
				<input
					placeholder="email@email.com"
					type="text"
					id="email"
					required
					value={email}
					onChange={e => setEmail(e.target.value)}
					name="email"
					className="input input-bordered"
				/>
			</div>

			<div className="flex flex-col w-full mb-5">
				<label htmlFor="password" className="text-blue-300 mb-2">Password:</label>
				<input
					placeholder="hunter2"
					type="text"
					id="password"
					required
					value={password}
					onChange={e => setPassword(e.target.value)}
					name="password"
					className="input input-bordered"
				/>
			</div>

			<div className="flex flex-col w-full mb-5">
				<label htmlFor="profilepic" className="text-blue-300 mb-2">Upload a profile picture:</label>
				<input
					type={"file"}
					className={"doggrFileUpload input input-bordered"}
					id={"profilepic"}
					name="profilepic"
					accept={"image/png, image/jpeg"}
					onChange={onFileChange}
				/>
			</div>

			{
				name != null && password != null && selectedFile != null &&
				<div>
					<button className="btn btn-primary btn-circle" onClick={onUploadFile}>Create</button>
				</div>
			}
		</div>
	);

};
