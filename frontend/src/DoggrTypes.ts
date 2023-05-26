export type State = {
	currentProfile: ProfileType;
	likeHistory: Array<ProfileType>;
	passHistory: Array<ProfileType>;
};

export type ProfileType = {
	imgUri: string;
	thumbUri: string;
	name: string;
	petType: string;
	id: number;
};
