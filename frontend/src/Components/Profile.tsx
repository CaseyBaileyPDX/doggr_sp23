import { ProfileType } from "@/DoggrTypes.ts";
import { useEffect } from "react";

export type ProfileProps = ProfileType & {
	onLikeButtonClick: () => void;
	onPassButtonClick: () => void;
};

export function Profile(props: ProfileProps) {
	const { imgUri, name, petType, onLikeButtonClick, onPassButtonClick } = props;

	useEffect(() => {
		console.log("Profile Rerendered.");
	});

	return (
		<div>
			<img src={imgUri} alt="Profile of pet" />
			<h2>{name}</h2>
			<div>Pet Type: {petType}</div>
			<div>
				<button onClick={onPassButtonClick}>Pass</button>
				<button onClick={onLikeButtonClick}>Like</button>
			</div>
		</div>
	);
}
