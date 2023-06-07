import { ProfileType } from "@/DoggrTypes.ts";
import { httpClient } from "@/Services/HttpClient.tsx";

export const ProfileService = {
	async getNextProfileFromServer() {
		const profile = await httpClient.get<ProfileType>("/profile");
		return profile.data;
	},

	async sendMessage(sender_id: number, receiver_id: number, message: string) {
		return httpClient.post("/messages", { sender_id, receiver_id, message});
	}
};

