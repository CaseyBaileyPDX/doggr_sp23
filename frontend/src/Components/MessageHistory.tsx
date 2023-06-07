import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { ProfileService } from "@/Services/ProfileService.tsx";
import { profileState } from "@/Services/RecoilState.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

type Message = [string, { id: string, name: string, imgUri: string }];
type MessageListItemProps = { message: Message, index: number, direction: string };

const minioHost = import.meta.env.MINIO_HOST;
const minioPort = import.meta.env.MINIO_PORT;
const minioBaseUrl = "http://" + minioHost + ":" + minioPort + "/doggr/";

export const MessageHistory = () => {
	const [sentMessages, setSentMessages] = useState([]);
	const [receivedMessages, setReceivedMessages] = useState([]);
	const auth = useAuth();
	const navigate = useNavigate();
	const setCurrentProfile = useSetRecoilState(profileState);

	useEffect( () => {
		async function getAllMessages() {
			try {
				const messagesResponse = await httpClient.search("/messages/all", {id: auth.userId});
				const messages = messagesResponse.data;
				setSentMessages(messages.sent);
				setReceivedMessages(messages.received);
			} catch (err) {
				console.error("Error getting sent messages: ", err);
			}
		}

		getAllMessages()
			.catch((error) => console.error("Failed to get messages", error));
	}, [auth.userId]);

	const onReplyButtonClick = (id: string) => {
		async function fetchProfile(id: number) {
			// Fetch the profile based on the ID, e.g., from an API or local data
			const profile = await ProfileService.fetchProfile(id);

			// Update the Recoil state with the fetched profile
			setCurrentProfile(profile);
		}

		// Fetch the profile and then navigate
		fetchProfile(Number(id))
			.then(() => navigate("/message"))
			.catch((error) => console.error("Failed to fetch profile", error));
	};

	const MessageListItem: React.FC<MessageListItemProps> = ({ message, index, direction }) => (
		<li key={index} className="flex items-center justify-between bg-secondary p-4 rounded-box mb-4">
			<div>
				<p className="text-lg">{message[0]}</p>
				<p className="m-2 text-sm text-neutral-content px-8">{direction}: {message[1].name}</p>
			</div>
			<div className="flex items-center">
				<img
					src={minioBaseUrl + message[1].imgUri}
					alt={message[1].name}
					className="w-12 h-12 rounded-full mr-4"
				/>
				<button
					onClick={() => onReplyButtonClick(message[1].id)}
					className="btn btn-primary btn-circle"
				>
					Reply
				</button>
			</div>
		</li>
	);

	return (
		<div className={"flex flex-col  justify-center items-center"}>
			<div className="text-2xl mb-4">Received:</div>
			<ul>
				{receivedMessages.map((message, index) =>
					<MessageListItem key={index} index={index} message={message} direction='From' />
				)}
			</ul>
			<div className="text-2xl mt-8 mb-4">Sent:</div>
			<ul>
				{sentMessages.map((message, index) =>
					<MessageListItem key={index} index={index} message={message} direction='To' />
				)}
			</ul>
		</div>
	);
	// return (
	// 	<>
	// 		<div>Received:</div>
	// 		<ul>
	// 			{receivedMessages.map((message, index) =>
	// 				<li key={index}>
	// 					<p>{message[0]}</p>
	// 					<div className="flex">
	// 						<p className={"m-2"}>From: {message[1].name}</p>
	// 						<img src={minioBaseUrl + message[1].imgUri} alt={message[1].name}
	// 						     style={{ width: "50px", height: "50px" }} />
	// 						<button onClick={() => onReplyButtonClick(message[1].id)}>Reply</button>
	// 					</div>
	// 				</li>
	// 			)}
	// 		</ul>
	// 		<div>Sent:</div>
	// 		<ul>
	// 			{sentMessages.map((message, index) =>
	// 				<li key={index}>
	// 					<p>{message[0]}</p>
	// 					<div className="flex">
	// 						<p className={"m-2"}>To: {message[1].name}</p>
	// 						<img src={minioBaseUrl + message[1].imgUri} alt={message[1].name}
	// 						     style={{ width: "50px", height: "50px" }} />
	// 						<button onClick={() => onReplyButtonClick(message[1].id)}>Reply</button>
	// 					</div>
	// 				</li>
	// 			)}
	// 		</ul>
	// 	</>
	// );
};



