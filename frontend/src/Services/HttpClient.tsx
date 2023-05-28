import { ProfileType } from "@/DoggrTypes.ts";
import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const serverIP = import.meta.env.API_HOST;
const serverPort = import.meta.env.PORT;

const serverUrl = `http://${serverIP}:${serverPort}`;

// This is why I use Axios over Fetch
export const httpClient = axios.create({
	baseURL: serverUrl,
	headers: {
		"Content-type": "application/json",
	},
});

export async function getNextProfileFromServer() {
	const profile =
		await httpClient.get<ProfileType>("/profile");
	return profile.data;
}

export async function getCurrentProfileFromServer(userId) {
	const profile =
		await httpClient.get<ProfileType>("/dbTest");
	return profile.data;
}

export async function postMessageToServer(userId,toId,message) {
		await httpClient.post("/messages",
		{"sender_id":`${userId}`,
		"receiver_id": `${toId}`,
		"message":`${message}`});
}
