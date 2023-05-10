import { ProfileType } from "@/DoggrTypes.ts";

const initialState: { likeHistory: ProfileType[]; currentProfile: ProfileType} = {
	currentProfile: getRandomProfile(),
	likeHistory: [getRandomProfile(), getRandomProfile()]
};

export default initialState;


export function getRandomProfile(): ProfileType {
	const idNum = Math.random() * 10000;

	return {
		imgUri: `https://loremflickr.com/300/300/animal?lock=${idNum}`,
		thumbUri: `https://loremflickr.com/75/75/animal?lock=${idNum}`,
		name: `Doggr${idNum}`,
		id: idNum
	};
}
