import { AuthContext } from "@/App.tsx";
import { Profile } from "@/Components/Profile.tsx";
import InitialState, { getRandomProfile } from "@/InitialState.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { useContext, useEffect, useState } from "react";

export const Match = () => {
	const [currentProfile, setCurrentProfile] = useState(InitialState.currentProfile);
	const [likeHistory, setLikeHistory] = useState(InitialState.likeHistory);
	const auth = useAuth();

	const onLikeButtonClick = () => {
		const newLikeHistory = [...likeHistory, currentProfile];
		setLikeHistory(newLikeHistory);
		const newProfile = getRandomProfile();
		setCurrentProfile(newProfile);
		console.log("Added new liked profile");
	};

	const onPassButtonClick = () => {
		const newProfile = getRandomProfile();
		setCurrentProfile(newProfile);
	};

	useEffect(() => {
		console.log("Match Rerendered.");
	});

	const profile = (
		<Profile
			{...currentProfile}
			onLikeButtonClick={onLikeButtonClick}
			onPassButtonClick={onPassButtonClick}
		/>
	);

	return (
		<>
			<div>"MATCH PAGE"</div>
			<p> User logged in as {auth.token}</p>
			{profile}
		</>
	);
};
