import { ProfileType } from "@/DoggrTypes.ts";
import { httpClient } from "@/Services/HttpClient.tsx";

export const ProfileService = {
	async getNextProfileFromServer() {
		const profile = await httpClient.get<ProfileType>("/profile");
		return profile.data;
	},

	async fetchProfile(id: number) {
		const profile = await httpClient.search("/users", {id});
		return profile.data;
	}

};

