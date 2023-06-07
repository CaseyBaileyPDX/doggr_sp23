import { httpClient } from "@/Services/HttpClient.tsx";

export const MessageService = {
	async sendMessage(sender_id: number, receiver_id: number, message: string) {
		return httpClient.post("/messages", { sender_id, receiver_id, message});
	},

	async getSentMessages(sender_id) {

	},

	async getReceivedMessages(receiver_id) {

	}
};
